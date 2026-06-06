import { NextResponse } from "next/server";
import { z } from "zod";
import { PlannerService } from "@/lib/ai/planner/planner";
import { AIError } from "@/lib/ai/types";

const PlannerRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
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

    const plannerService = PlannerService.getInstance();
    const plan = await plannerService.generatePlan(parsed.data.prompt);

    return NextResponse.json({ success: true, plan }, { status: 200 });
  } catch (error) {
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
