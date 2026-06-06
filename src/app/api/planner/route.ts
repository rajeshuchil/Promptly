import { NextResponse } from "next/server";
import { z } from "zod";
import { PlannerService } from "@/lib/ai/planner/planner";
import { AIError } from "@/lib/ai/types";
import { requireUser } from "@/lib/auth";
import { EntitlementsService } from "@/lib/billing";

const PlannerRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
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

    const promptText = parsed.data.prompt;

    // Check usage limits using entitlements policy
    const entitlementsService = EntitlementsService.getInstance();
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

    const plannerService = PlannerService.getInstance();
    const plan = await plannerService.generatePlan(promptText, { userId: user.id });

    return NextResponse.json({ success: true, plan }, { status: 200 });
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
          message: error instanceof Error ? error.message : "Unexpected error",
        },
      },
      { status: 500 }
    );
  }
}
