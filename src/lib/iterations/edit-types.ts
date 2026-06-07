import type { Plan } from "../ai/planner/schemas";
import type { QualityReport } from "../ai/validator/quality-evaluator";

export interface IterationInput {
  projectId: string;
  prompt: string; // The user's natural language edit request
  userId: string;
}

export interface IterationOutput {
  projectId: string;
  revisionNumber: number;
  html: string;
  plan: Plan;
  quality?: QualityReport;
}

export interface RevisionHistoryEntry {
  id: string;
  revisionNumber: number;
  prompt: string;
  plan: Plan;
  html: string;
  meta: any;
  createdAt: string;
}

export type TimelineEventType = "created" | "generated" | "edited" | "published" | "exported";

export interface TimelineEventEntry {
  id: string;
  projectId: string;
  userId: string;
  eventType: TimelineEventType;
  eventMetadata: any;
  createdAt: string;
}
