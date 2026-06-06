import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { stripe, isStripeMocked } from "./stripe";

export class CustomerService {
  private static instance: CustomerService;

  private constructor() {}

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  /**
   * Retrieves or creates a Stripe Customer ID for the active user.
   * Leverages Stripe API with a robust mock fallback for developer testing.
   */
  async getOrCreateCustomer(userId: string, email: string, name?: string | null): Promise<string> {
    const [existing] = await db
      .select()
      .from(schema.subscriptions)
      .where(eq(schema.subscriptions.userId, userId));

    if (existing?.stripeCustomerId) {
      return existing.stripeCustomerId;
    }

    let stripeCustomerId = `cus_mock_${userId.slice(0, 8)}`;

    if (!isStripeMocked()) {
      try {
        const customer = await stripe.customers.create({
          email,
          name: name || undefined,
          metadata: { userId },
        });
        stripeCustomerId = customer.id;
      } catch (err) {
        console.error("Failed to create customer in Stripe, falling back to mock:", err);
      }
    }

    if (existing) {
      await db
        .update(schema.subscriptions)
        .set({ stripeCustomerId, updatedAt: new Date() })
        .where(eq(schema.subscriptions.userId, userId));
    } else {
      await db
        .insert(schema.subscriptions)
        .values({
          userId,
          stripeCustomerId,
          plan: "free",
        });
    }

    return stripeCustomerId;
  }
}
