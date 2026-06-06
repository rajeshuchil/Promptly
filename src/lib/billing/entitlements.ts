import { SubscriptionService } from "./subscription-service";
import { UsageService } from "@/lib/usage/usage-service";
import type { PlanTier } from "./types";

export class EntitlementsService {
  private static instance: EntitlementsService;
  private subscriptionService: SubscriptionService;
  private usageService: UsageService;

  private constructor() {
    this.subscriptionService = SubscriptionService.getInstance();
    this.usageService = UsageService.getInstance();
  }

  public static getInstance(): EntitlementsService {
    if (!EntitlementsService.instance) {
      EntitlementsService.instance = new EntitlementsService();
    }
    return EntitlementsService.instance;
  }

  /**
   * Configures capabilities for each pricing tier.
   */
  getPlanLimits(plan: PlanTier) {
    const limits = {
      free: {
        generationLimit: 10,
        allowPremiumModels: false,
        allowDeployments: false,
      },
      pro: {
        generationLimit: 100,
        allowPremiumModels: true,
        allowDeployments: true,
      },
      enterprise: {
        generationLimit: 10000,
        allowPremiumModels: true,
        allowDeployments: true,
      },
    };
    return limits[plan] || limits.free;
  }

  /**
   * Checks if user has generation capacity remaining.
   */
  async canGenerate(userId: string): Promise<{ allowed: boolean; message?: string }> {
    const sub = await this.subscriptionService.getSubscription(userId);
    const limits = this.getPlanLimits(sub.plan);

    const now = new Date();
    const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const countThisMonth = await this.usageService.getUserMetrics(userId).then(m => m.generationsThisMonth);

    if (countThisMonth >= limits.generationLimit) {
      return {
        allowed: false,
        message: `Generation quota exceeded for the month (${countThisMonth}/${limits.generationLimit} runs). Please upgrade your subscription plan.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Entitles live project deployment publish requests.
   */
  async canDeploy(userId: string): Promise<{ allowed: boolean; message?: string }> {
    const sub = await this.subscriptionService.getSubscription(userId);
    const limits = this.getPlanLimits(sub.plan);

    if (!limits.allowDeployments) {
      return {
        allowed: false,
        message: "Publishing sites to custom domains is restricted to Pro and Enterprise tiers.",
      };
    }

    return { allowed: true };
  }

  /**
   * Gates premium model selection (e.g. gemini-2.5-pro vs flash).
   */
  async canUsePremiumModels(userId: string): Promise<{ allowed: boolean; message?: string }> {
    const sub = await this.subscriptionService.getSubscription(userId);
    const limits = this.getPlanLimits(sub.plan);

    if (!limits.allowPremiumModels) {
      return {
        allowed: false,
        message: "Access to advanced Reasoning Models (Gemini 2.5 Pro) is restricted to Pro and Enterprise tiers.",
      };
    }

    return { allowed: true };
  }
}
