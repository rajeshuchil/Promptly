export type PlanTier = "free" | "pro" | "enterprise";

export interface PlanConfig {
  tier: PlanTier;
  name: string;
  priceId: string | null;
  generationLimit: number;
  allowPremiumModels: boolean;
  allowDeployments: boolean;
}

export interface UserSubscriptionDetails {
  plan: PlanTier;
  status: string | null;
  currentPeriodEnd: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}
