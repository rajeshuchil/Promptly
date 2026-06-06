import { NextResponse } from "next/server";
import { z } from "zod";
import { PlannerService } from "@/lib/ai/planner/planner";
import { AIError } from "@/lib/ai/types";
import { requireUser } from "@/lib/auth";
import { UsageService } from "@/lib/usage";

const PlannerRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  const user = await requireUser();
  let status: "success" | "failed" = "success";
  let errorMessage: string | null = null;
  let promptText = "";

  try {
    const body = await request.json();
    const parsed = PlannerRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid request payload",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    promptText = parsed.data.prompt;

    // Check usage limits
    const usageService = UsageService.getInstance();
    const planDetails = await usageService.getPlanDetails(user.id);
    if (planDetails.isOverLimit) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Usage limit exceeded (${planDetails.generationsUsed}/${planDetails.generationLimit} generations). Please upgrade your plan.`,
            code: "LIMIT_EXCEEDED",
          },
        },
        { status: 403 }
      );
    }

    const plannerService = PlannerService.getInstance();
    let plan;
    try {
      plan = await plannerService.generatePlan(promptText);
      
      // Record successful planner execution
      await usageService.recordUsage({
        userId: user.id,
        model: "gemini-2.5-flash",
        provider: "google",
        promptLength: promptText.length,
        outputLength: JSON.stringify(plan).length,
        status: "success",
        phase: "planner",
      });

      return NextResponse.json({ success: true, plan }, { status: 200 });
    } catch (e: any) {
      status = "failed";
      errorMessage = e.message || "Planner generation failed";
      
      // Record failed planner execution
      await usageService.recordUsage({
        userId: user.id,
        model: "gemini-2.5-flash",
        provider: "google",
        promptLength: promptText.length,
        outputLength: 0,
        status: "failed",
        phase: "planner",
        errorMessage,
      });
      
      throw e;
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
          },
        },
        { status: 401 }
      );
    }

    if (error instanceof AIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Unexpected error",
        },
      },
      { status: 500 }
    );
  }
}
