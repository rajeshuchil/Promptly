import { NextResponse } from "next/server";
import { PlannerService } from "@/lib/ai/planner/planner";
import { GeneratorService } from "@/lib/ai/generator/generator";
import { GenerateRequestSchema } from "@/lib/ai/generator/schemas";
import { AIError } from "@/lib/ai/types";

/**
 * POST /api/generate
 *
 * Full pipeline:  Prompt → Planner → Generator → HTML
 *
 * Request body:
 *   {
 *     "prompt": string,          // required, 1-2000 chars
 *     "style":  "standard"       // optional: "standard" | "minimal" | "rich"
 *              | "minimal"
 *              | "rich"
 *   }
 *
 * Success response (200):
 *   {
 *     "success": true,
 *     "plan":    { ...Plan },
 *     "html":    "<html>...</html>",
 *     "meta":    { model, promptStyle, durationMs, outputLength, generatedAt }
 *   }
 *
 * Error response:
 *   {
 *     "success": false,
 *     "error":   { "message": string, "code"?: string, "phase"?: string }
 *   }
 *
 * The "phase" field tells the caller where in the pipeline the failure occurred:
 *   "validation" | "planning" | "generation"
 */
export async function POST(request: Request) {
  // ── 1. Validate request body ───────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Request body must be valid JSON", phase: "validation" },
      },
      { status: 400 }
    );
  }

  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Invalid request payload",
          details: parsed.error.flatten(),
          phase: "validation",
        },
      },
      { status: 400 }
    );
  }

  const { prompt, style } = parsed.data;

  // ── 2. Run Planner ─────────────────────────────────────────────────────────
  let plan;
  try {
    const plannerService = PlannerService.getInstance();
    plan = await plannerService.generatePlanWithRetry(prompt, 2);
  } catch (error) {
    if (error instanceof AIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            phase: "planning",
          },
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: { message: "Planning phase encountered an unexpected error", phase: "planning" },
      },
      { status: 500 }
    );
  }

  // ── 3. Run Generator ───────────────────────────────────────────────────────
  let generatorOutput;
  try {
    const generatorService = GeneratorService.getInstance();
    generatorOutput = await generatorService.generateWithRetry(
      { prompt, plan },
      2,
      { style }
    );
  } catch (error) {
    if (error instanceof AIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            phase: "generation",
          },
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Generation phase encountered an unexpected error",
          phase: "generation",
        },
      },
      { status: 500 }
    );
  }

  // ── 4. Return ──────────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      plan,
      html: generatorOutput.html,
      meta: generatorOutput.meta,
    },
    { status: 200 }
  );
}
