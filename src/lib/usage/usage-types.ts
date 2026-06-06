import type { UsageLog } from "@/lib/db/schema";

export type PlanType = "free" | "pro" | "enterprise";

export interface CreateUsageInput {
  userId: string;
  projectId?: string | null;
  model: string;
  provider: string;
  promptLength: number;
  outputLength: number;
  status: "success" | "failed";
  phase: "planner" | "generator" | "validator";
  errorMessage?: string | null;
}

export interface ModelUsageMetric {
  model: string;
  count: number;
}

export interface RecentActivityMetric {
  id: string;
  phase: "planner" | "generator" | "validator";
  status: "success" | "failed";
  model: string;
  createdAt: Date;
}

export interface UserUsageMetrics {
  totalGenerations: number;
  generationsThisMonth: number;
  generationsByModel: ModelUsageMetric[];
  recentActivity: RecentActivityMetric[];
}

export interface UserPlanDetails {
  plan: PlanType;
  generationLimit: number;
  generationsUsed: number;
  isOverLimit: boolean;
}
