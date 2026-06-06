import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key_12345";

export const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2025-01-27.acacia" as any,
  typescript: true,
});

/**
 * Checks if Stripe client is in mock mode.
 */
export function isStripeMocked(): boolean {
  return stripeApiKey.startsWith("sk_test_mock");
}
