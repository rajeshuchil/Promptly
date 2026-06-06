import { db, schema } from "@/lib/db";
import { eq, and, gte, sql } from "drizzle-orm";
import type { CreateUsageInput, ModelUsageMetric, RecentActivityMetric } from "./usage-types";

export class UsageRepository {
  private static instance: UsageRepository;

  private constructor() {}

  public static getInstance(): UsageRepository {
    if (!UsageRepository.instance) {
      UsageRepository.instance = new UsageRepository();
    }
    return UsageRepository.instance;
  }

  /**
   * Persist a new usage log entry.
   */
  async create(data: CreateUsageInput) {
    const [log] = await db
      .insert(schema.usageLogs)
      .values({
        userId: data.userId,
        projectId: data.projectId ?? null,
        model: data.model,
        provider: data.provider,
        promptLength: data.promptLength,
        outputLength: data.outputLength,
        status: data.status,
        phase: data.phase,
        errorMessage: data.errorMessage ?? null,
      })
      .returning();
    return log;
  }

  /**
   * Get the total successful generations count for a user.
   */
  async getTotalCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.usageLogs)
      .where(and(eq(schema.usageLogs.userId, userId), eq(schema.usageLogs.status, "success")));
    return result?.count ?? 0;
  }

  /**
   * Get successful generations count since a specific timestamp.
   */
  async getCountSince(userId: string, sinceDate: Date): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.usageLogs)
      .where(
        and(
          eq(schema.usageLogs.userId, userId),
          eq(schema.usageLogs.status, "success"),
          gte(schema.usageLogs.createdAt, sinceDate)
        )
      );
    return result?.count ?? 0;
  }

  /**
   * Group generations by AI model and count successful requests.
   */
  async getModelCounts(userId: string): Promise<ModelUsageMetric[]> {
    const results = await db
      .select({
        model: schema.usageLogs.model,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.usageLogs)
      .where(and(eq(schema.usageLogs.userId, userId), eq(schema.usageLogs.status, "success")))
      .groupBy(schema.usageLogs.model);
    return results;
  }

  /**
   * Fetch recent activity logs (successful or failed) for audit/metrics display.
   */
  async getRecentLogs(userId: string, limit = 10): Promise<RecentActivityMetric[]> {
    const results = await db
      .select({
        id: schema.usageLogs.id,
        phase: schema.usageLogs.phase,
        status: schema.usageLogs.status,
        model: schema.usageLogs.model,
        createdAt: schema.usageLogs.createdAt,
      })
      .from(schema.usageLogs)
      .where(eq(schema.usageLogs.userId, userId))
      .orderBy(sql`${schema.usageLogs.createdAt} desc`)
      .limit(limit);
      
    return results as RecentActivityMetric[];
  }
}
