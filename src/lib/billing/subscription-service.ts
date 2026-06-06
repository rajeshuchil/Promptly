import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { PlanTier, UserSubscriptionDetails } from "./types";

export class SubscriptionService {
  private static instance: SubscriptionService;

  private constructor() {}

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  /**
   * Translates Stripe Price ID to PlanTier.
   */
  getPlanFromPriceId(priceId: string | null): PlanTier {
    if (!priceId) return "free";
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "pro";
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID) return "enterprise";
    return "free";
  }

  /**
   * Retrieves subscription properties for a given user.
   */
  async getSubscription(userId: string): Promise<UserSubscriptionDetails> {
    const [sub] = await db
      .select()
      .from(schema.subscriptions)
      .where(eq(schema.subscriptions.userId, userId));

    return {
      plan: (sub?.plan as PlanTier) || "free",
      status: sub?.stripeSubscriptionStatus || null,
      currentPeriodEnd: sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null,
      stripeCustomerId: sub?.stripeCustomerId || null,
      stripeSubscriptionId: sub?.stripeSubscriptionId || null,
    };
  }

  /**
   * Updates user subscription based on Stripe subscription ID.
   */
  async updateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    data: {
      stripeCustomerId?: string;
      stripePriceId?: string | null;
      stripeSubscriptionStatus?: string;
      currentPeriodEnd?: Date | null;
    }
  ): Promise<boolean> {
    const plan = this.getPlanFromPriceId(data.stripePriceId || null);

    const updatePayload: any = {
      plan,
      updatedAt: new Date(),
    };
    if (data.stripeCustomerId) updatePayload.stripeCustomerId = data.stripeCustomerId;
    if (data.stripePriceId !== undefined) updatePayload.stripePriceId = data.stripePriceId;
    if (data.stripeSubscriptionStatus) updatePayload.stripeSubscriptionStatus = data.stripeSubscriptionStatus;
    if (data.currentPeriodEnd !== undefined) updatePayload.currentPeriodEnd = data.currentPeriodEnd;

    const result = await db
      .update(schema.subscriptions)
      .set(updatePayload)
      .where(eq(schema.subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();

    return result.length > 0;
  }

  /**
   * Integrates customer-specific database updates (e.g. checkout completion mapping).
   */
  async updateSubscriptionByCustomerId(
    stripeCustomerId: string,
    data: {
      stripeSubscriptionId?: string | null;
      stripePriceId?: string | null;
      stripeSubscriptionStatus?: string | null;
      currentPeriodEnd?: Date | null;
    }
  ): Promise<boolean> {
    const plan = this.getPlanFromPriceId(data.stripePriceId || null);

    const updatePayload: any = {
      plan,
      updatedAt: new Date(),
    };
    if (data.stripeSubscriptionId !== undefined) updatePayload.stripeSubscriptionId = data.stripeSubscriptionId;
    if (data.stripePriceId !== undefined) updatePayload.stripePriceId = data.stripePriceId;
    if (data.stripeSubscriptionStatus !== undefined) updatePayload.stripeSubscriptionStatus = data.stripeSubscriptionStatus;
    if (data.currentPeriodEnd !== undefined) updatePayload.currentPeriodEnd = data.currentPeriodEnd;

    const result = await db
      .update(schema.subscriptions)
      .set(updatePayload)
      .where(eq(schema.subscriptions.stripeCustomerId, stripeCustomerId))
      .returning();

    return result.length > 0;
  }
}
