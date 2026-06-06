import { NextResponse } from "next/server";
import { stripe, isStripeMocked } from "@/lib/billing/stripe";
import { SubscriptionService } from "@/lib/billing/subscription-service";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/stripe
 *
 * Direct entry point for Stripe Webhooks.
 * Supports signature verification, with developer bypass for offline mock testing.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  if (isStripeMocked() || !signature || !webhookSecret) {
    // Developer bypass: parse body directly for mock testing
    try {
      event = JSON.parse(body);
      console.log("Stripe Webhook (Mock Mode) received event type:", event?.type);
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }
  } else {
    // Secure production verification
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Stripe Webhook (Live Mode) verified event type:", event?.type);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ success: false, error: "Webhook signature verification failed" }, { status: 400 });
    }
  }

  const subscriptionService = SubscriptionService.getInstance();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (userId) {
          // If we are live, query subscription details from Stripe
          let priceId: string | null = (session as any).line_items?.data?.[0]?.price?.id || null;
          let status = "active";
          let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default

          if (!isStripeMocked() && stripeSubscriptionId) {
            try {
              const subDetail = (await stripe.subscriptions.retrieve(stripeSubscriptionId)) as any;
              priceId = subDetail.items?.data?.[0]?.price?.id || null;
              status = subDetail.status;
              currentPeriodEnd = new Date(subDetail.current_period_end * 1000);
            } catch (err) {
              console.error("Failed to fetch Stripe sub details:", err);
            }
          } else if (isStripeMocked()) {
            // Read simulated priceId passed through query parameters or body
            priceId = (session as any).metadata?.priceId || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || null;
          }

          const plan = subscriptionService.getPlanFromPriceId(priceId);

          // Upsert the subscription
          const [existing] = await db
            .select()
            .from(schema.subscriptions)
            .where(eq(schema.subscriptions.userId, userId));

          if (existing) {
            await db
              .update(schema.subscriptions)
              .set({
                stripeCustomerId,
                stripeSubscriptionId,
                stripePriceId: priceId,
                stripeSubscriptionStatus: status,
                plan,
                currentPeriodEnd,
                updatedAt: new Date(),
              })
              .where(eq(schema.subscriptions.userId, userId));
          } else {
            await db
              .insert(schema.subscriptions)
              .values({
                userId,
                stripeCustomerId,
                stripeSubscriptionId,
                stripePriceId: priceId,
                stripeSubscriptionStatus: status,
                plan,
                currentPeriodEnd,
              });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const stripeSubscriptionId = sub.id;
        const stripeCustomerId = sub.customer as string;
        const priceId = sub.items?.data?.[0]?.price?.id || null;
        const status = sub.status;
        const currentPeriodEnd = new Date(sub.current_period_end * 1000);

        // Update database using stripeSubscriptionId
        const updated = await subscriptionService.updateSubscriptionByStripeId(stripeSubscriptionId, {
          stripeCustomerId,
          stripePriceId: priceId,
          stripeSubscriptionStatus: status,
          currentPeriodEnd,
        });

        // Fallback: update by customerId if subscription mapping record is not yet linked
        if (!updated) {
          await subscriptionService.updateSubscriptionByCustomerId(stripeCustomerId, {
            stripeSubscriptionId,
            stripePriceId: priceId,
            stripeSubscriptionStatus: status,
            currentPeriodEnd,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const stripeSubscriptionId = sub.id;

        await subscriptionService.updateSubscriptionByStripeId(stripeSubscriptionId, {
          stripePriceId: null,
          stripeSubscriptionStatus: "canceled",
          currentPeriodEnd: null,
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook event handling failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
