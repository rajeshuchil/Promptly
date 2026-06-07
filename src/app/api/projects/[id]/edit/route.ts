import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { EntitlementsService } from "@/lib/billing";
import { UsageService } from "@/lib/usage";
import { IterationService } from "@/lib/iterations/iteration-service";
import { EditRequestSchema } from "@/lib/iterations/edit-schemas";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * POST /api/projects/[id]/edit
 *
 * Receives natural language edit requests, refines the design plan, streams the revised code,
 * executes the quality evaluator, and saves the new project revision.
 */
export async function POST(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized: Authentication required" } },
      { status: 401 }
    );
  }

  const { id: projectId } = await params;
  const usageService = UsageService.getInstance();
  const entitlementsService = EntitlementsService.getInstance();

  // Enforce SaaS plan limits check
  try {
    const check = await entitlementsService.canGenerate(user.id);
    if (!check.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: check.message,
            code: "LIMIT_EXCEEDED",
          },
        },
        { status: 403 }
      );
    }
  } catch (err) {
    console.error("Failed to check plan limits:", err);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Request body must be valid JSON" } },
      { status: 400 }
    );
  }

  const parsed = EditRequestSchema.safeParse({
    projectId,
    prompt: body.prompt,
    style: body.style,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Invalid edit request parameters",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  const { prompt } = parsed.data;
  const encoder = new TextEncoder();

  // Stream iteration events to client
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        if (request.signal.aborted) {
          sendEvent("error", { message: "Client disconnected" });
          controller.close();
          return;
        }

        const iterationService = IterationService.getInstance();
        const iterator = iterationService.iterate({
          projectId,
          prompt,
          userId: user.id,
        });

        let lastHtml = "";
        let finalPlan: any = null;

        for await (const step of iterator) {
          if (request.signal.aborted) {
            sendEvent("error", { message: "Client disconnected during iteration" });
            break;
          }

          if (step.event === "error") {
            sendEvent("error", { message: step.message });
            break;
          }

          if (step.event === "chunk" && step.chunk) {
            lastHtml += step.chunk;
          }

          if (step.event === "planning" && step.plan) {
            finalPlan = step.plan;
          }

          // Forward event to SSE client
          sendEvent(step.event, step);
        }

        // Record usage log on success
        if (lastHtml) {
          await usageService.recordUsage({
            userId: user.id,
            projectId,
            model: "gemini-2.5-flash",
            provider: "google",
            promptLength: prompt.length,
            outputLength: lastHtml.length,
            status: "success",
            phase: "generator",
          });
        }
      } catch (error: any) {
        sendEvent("error", {
          message: error.message || "Failed to process edit request",
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
