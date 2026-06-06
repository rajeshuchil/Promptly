import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BillingService } from "@/lib/billing";
import { CheckoutSessionInputSchema } from "@/lib/billing/schemas";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/checkout
 *
 * Initiates Stripe checkout session for plan subscription.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "User email is required to initiate billing operations",
          },
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = CheckoutSessionInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid checkout configuration",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { priceId, successUrl, cancelUrl } = parsed.data;
    const billingService = BillingService.getInstance();

    const checkoutUrl = await billingService.createCheckoutSession(
      user.id,
      user.email,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({
      success: true,
      url: checkoutUrl,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
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
