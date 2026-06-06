import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { UsageService } from "@/lib/usage";

export const dynamic = "force-dynamic";

/**
 * GET /api/usage
 *
 * Retrieves usage metrics and plan tier details for the authenticated user.
 */
export async function GET() {
  try {
    const user = await requireUser();

    const usageService = UsageService.getInstance();
    const metrics = await usageService.getUserMetrics(user.id);
    const plan = await usageService.getPlanDetails(user.id);

    return NextResponse.json({
      success: true,
      metrics,
      plan,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Failed to fetch usage metrics";
    const statusCode = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
        },
      },
      { status: statusCode }
    );
  }
}
