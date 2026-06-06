import { z } from "zod";

export const CheckoutSessionInputSchema = z.object({
  priceId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const BillingPortalInputSchema = z.object({
  returnUrl: z.string().url(),
});
