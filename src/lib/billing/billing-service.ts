import { stripe, isStripeMocked } from "./stripe";
import { CustomerService } from "./customer-service";
import { SubscriptionService } from "./subscription-service";

export class BillingService {
  private static instance: BillingService;
  private customerService: CustomerService;
  private subscriptionService: SubscriptionService;

  private constructor() {
    this.customerService = CustomerService.getInstance();
    this.subscriptionService = SubscriptionService.getInstance();
  }

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  /**
   * Generates checkout URL for subscribing to a pricing plan tier.
   * Handles mock redirection for easy developer-mode validation.
   */
  async createCheckoutSession(
    userId: string,
    email: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const customerId = await this.customerService.getOrCreateCustomer(userId, email);

    if (isStripeMocked()) {
      const mockUrl = new URL(successUrl);
      mockUrl.searchParams.set("session_id", `cs_mock_${Date.now()}`);
      mockUrl.searchParams.set("price_id", priceId);
      mockUrl.searchParams.set("customer_id", customerId);
      return mockUrl.toString();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId },
    });

    return session.url || successUrl;
  }

  /**
   * Generates user-specific billing portal configuration link.
   * Handles mock redirection for local/dev environments.
   */
  async createBillingPortalSession(userId: string, returnUrl: string): Promise<string> {
    const sub = await this.subscriptionService.getSubscription(userId);
    if (!sub.stripeCustomerId) {
      throw new Error("No billing history found for this user. Please upgrade first.");
    }

    if (isStripeMocked()) {
      const mockUrl = new URL(returnUrl);
      mockUrl.searchParams.set("mock-portal", "success");
      return mockUrl.toString();
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: returnUrl,
    });

    return session.url;
  }
}
