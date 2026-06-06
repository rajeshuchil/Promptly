import { SubscriptionService } from "@/lib/billing/subscription-service";
import { UsageRepository } from "./usage-repository";
import { CreateUsageInputSchema } from "./usage-schemas";
import type { CreateUsageInput, UserUsageMetrics, UserPlanDetails, PlanType } from "./usage-types";

export class UsageService {
  private static instance: UsageService;
  private repository: UsageRepository;

  private constructor() {
    this.repository = UsageRepository.getInstance();
  }

  public static getInstance(): UsageService {
    if (!UsageService.instance) {
      UsageService.instance = new UsageService();
    }
    return UsageService.instance;
  }

  /**
   * Log a new generation/planning event with Zod validation.
   */
  async recordUsage(input: CreateUsageInput) {
    const parsed = CreateUsageInputSchema.parse(input);
    return await this.repository.create(parsed);
  }

  /**
   * Fetch all key SaaS metrics required for dashboard statistics.
   */
  async getUserMetrics(userId: string): Promise<UserUsageMetrics> {
    const totalGenerations = await this.repository.getTotalCount(userId);

    // Calculate start of current month in UTC
    const now = new Date();
    const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const generationsThisMonth = await this.repository.getCountSince(userId, firstDayOfMonth);

    const generationsByModel = await this.repository.getModelCounts(userId);
    const recentActivity = await this.repository.getRecentLogs(userId, 5);

    return {
      totalGenerations,
      generationsThisMonth,
      generationsByModel,
      recentActivity,
    };
  }

  /**
   * Fetch plan and usage details for plan enforcement and future subscription gates.
   */
  async getPlanDetails(userId: string): Promise<UserPlanDetails> {
    const subscriptionService = SubscriptionService.getInstance();
    const sub = await subscriptionService.getSubscription(userId);
    const plan = sub.plan as PlanType;
    
    // Limits definition
    const limits: Record<PlanType, number> = {
      free: 10,
      pro: 100,
      enterprise: 10000,
    };

    const now = new Date();
    const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const generationsUsed = await this.repository.getCountSince(userId, firstDayOfMonth);
    const generationLimit = limits[plan] || 10;

    return {
      userId,
      plan,
      generationLimit,
      generationsUsed,
      isOverLimit: generationsUsed >= generationLimit,
    };
  }
}
