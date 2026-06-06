import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BillingService } from "@/lib/billing";
import { BillingPortalInputSchema } from "@/lib/billing/schemas";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/portal
 *
 * Generates Stripe Customer Portal link to manage active subscriptions.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const parsed = BillingPortalInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid portal configuration",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { returnUrl } = parsed.data;
    const billingService = BillingService.getInstance();

    const portalUrl = await billingService.createBillingPortalSession(user.id, returnUrl);

    return NextResponse.json({
      success: true,
      url: portalUrl,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Failed to create portal session";
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
