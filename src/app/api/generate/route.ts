import { PlannerService } from "@/lib/ai/planner/planner";
import { GeneratorService } from "@/lib/ai/generator/generator";
import { HtmlValidator } from "@/lib/ai/validator/validator";
import { ProjectService } from "@/lib/projects/project-service";
import { GenerateRequestSchema } from "@/lib/ai/generator/schemas";
import { AIError } from "@/lib/ai/types";
import { getCurrentUser } from "@/lib/auth";
import { UsageService } from "@/lib/usage";
import { EntitlementsService } from "@/lib/billing";

export const runtime = "nodejs";

/**
 * POST /api/generate
 *
 * Emits progressive server-sent events (SSE) for the generation process
 */
export async function POST(request: Request) {
  // Enforce session check before starting stream
  const user = await getCurrentUser();
  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: "Unauthorized: Authentication required", phase: "validation" },
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const usageService = UsageService.getInstance();

  // Check usage limits using entitlements policy
  const entitlementsService = EntitlementsService.getInstance();
  try {
    const check = await entitlementsService.canGenerate(user.id);
    if (!check.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: check.message,
            code: "LIMIT_EXCEEDED",
            phase: "validation",
          },
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("Failed to check plan limits:", err);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: "Request body must be valid JSON", phase: "validation" },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: "Invalid request payload",
          details: parsed.error.flatten(),
          phase: "validation",
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { prompt, style } = parsed.data;
  const encoder = new TextEncoder();

  // Create stream
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        // Handle abort client signal
        if (request.signal.aborted) {
          sendEvent("error", { message: "Client disconnected", phase: "network" });
          controller.close();
          return;
        }

        // ── 1. Planning Phase ────────────────────────────────────────────────
        sendEvent("planning", { message: "Creating planner layout strategy..." });
        
        let plan;
        try {
          const plannerService = PlannerService.getInstance();
          plan = await plannerService.generatePlanWithRetry(prompt, 2, { userId: user.id });
        } catch (e: any) {
          throw e;
        }

        if (request.signal.aborted) {
          sendEvent("error", { message: "Client disconnected", phase: "network" });
          controller.close();
          return;
        }

        // ── 2. Generation Phase ──────────────────────────────────────────────
        sendEvent("generating", {
          message: "Structure planned. Generating code...",
          plan,
        });

        let cleanedHtml = "";
        try {
          const generatorService = GeneratorService.getInstance();
          const generatorStream = generatorService.stream(
            { prompt, plan },
            { style, userId: user.id }
          );

          let accumulatedHtml = "";
          for await (const chunk of generatorStream) {
            if (request.signal.aborted) {
              sendEvent("error", { message: "Client disconnected", phase: "network" });
              controller.close();
              return;
            }
            accumulatedHtml += chunk;
            sendEvent("chunk", { chunk });
          }

          cleanedHtml = generatorService.cleanRawOutput(accumulatedHtml);
        } catch (e: any) {
          throw e;
        }

        // ── 3. Validation Phase ──────────────────────────────────────────────
        sendEvent("validating", { message: "Validating generated markup..." });

        const validator = HtmlValidator.getInstance();
        const validationReport = validator.validateAndRepair(cleanedHtml);

        if (!validationReport.valid) {
          await usageService.recordUsage({
            userId: user.id,
            model: "local-html-parser",
            provider: "fastapp",
            promptLength: cleanedHtml.length,
            outputLength: 0,
            status: "failed",
            phase: "validator",
            errorMessage: "HTML validation failed and could not be repaired",
          });

          sendEvent("error", {
            message: "HTML validation failed and could not be repaired.",
            phase: "validation",
            validation: {
              valid: validationReport.valid,
              repaired: validationReport.repaired,
              issues: validationReport.issues,
            },
          });
          controller.close();
          return;
        }

        // ── 4. Persistence Phase ──────────────────────────────────────────────
        sendEvent("saving", { message: "Finalizing and saving website..." });

        const projectService = ProjectService.getInstance();
        const userId = user.id;

        const capitalizedType = plan.pageType
          ? plan.pageType.charAt(0).toUpperCase() + plan.pageType.slice(1)
          : "Landing Page";
        const projectName = `FastApp ${capitalizedType} - ${style}`;

        const generatedMeta = {
          plan,
          generatorMeta: {
            model: "gemini-2.5-flash",
            promptStyle: style,
            durationMs: 0,
            outputLength: validationReport.html.length,
            generatedAt: new Date().toISOString(),
          },
          validation: {
            valid: validationReport.valid,
            repaired: validationReport.repaired,
            issues: validationReport.issues,
          },
        };

        const project = await projectService.createProject({
          userId,
          name: projectName,
          prompt,
          generatedHtml: validationReport.html,
          generatedMeta,
          deploymentState: "generated",
          aiModel: "gemini-2.5-flash",
        });

        // Record successful validation and storage linked to projectId
        await usageService.recordUsage({
          userId: user.id,
          projectId: project.id,
          model: "local-html-parser",
          provider: "fastapp",
          promptLength: cleanedHtml.length,
          outputLength: validationReport.html.length,
          status: "success",
          phase: "validator",
        });

        // ── 5. Completion ────────────────────────────────────────────────────
        sendEvent("complete", {
          projectId: project.id,
          html: validationReport.html,
          plan,
          validation: {
            valid: validationReport.valid,
            repaired: validationReport.repaired,
            issues: validationReport.issues,
          },
        });
      } catch (error) {
        let message = "Unexpected generation error";
        let code = "UNKNOWN_ERROR";

        if (error instanceof AIError) {
          message = error.message;
          code = error.code;
        } else if (error instanceof Error) {
          message = error.message;
        }

        sendEvent("error", {
          message,
          code,
          phase: "generation",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
