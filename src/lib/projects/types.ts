import type { Plan } from "@/lib/ai/planner/schemas";

export type DeploymentState =
  | "idle"
  | "generating"
  | "generated"
  | "queued"
  | "building"
  | "deploying"
  | "deployed"
  | "failed";

export interface GeneratedProjectMeta {
  plan: Plan;
  generatorMeta: {
    model: string;
    promptStyle: string;
    durationMs: number;
    outputLength: number;
    generatedAt: string;
  };
  validation: {
    valid: boolean;
    repaired: boolean;
    issues: string[];
  };
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  prompt: string;
  generatedHtml: string | null;
  generatedCss: string | null;
  generatedMeta: GeneratedProjectMeta | null;
  deploymentState: DeploymentState;
  deployedUrl: string | null;
  errorMessage: string | null;
  deploymentMetadata: any | null;
  deploymentTimestamp: Date | null;
  aiModel: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  userId: string;
  name?: string;
  prompt: string;
  generatedHtml?: string;
  generatedCss?: string;
  generatedMeta?: GeneratedProjectMeta;
  deploymentState?: DeploymentState;
  deployedUrl?: string | null;
  errorMessage?: string | null;
  deploymentMetadata?: any | null;
  deploymentTimestamp?: Date | null;
  aiModel?: string;
  isFavorite?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  prompt?: string;
  generatedHtml?: string;
  generatedCss?: string;
  generatedMeta?: GeneratedProjectMeta;
  deploymentState?: DeploymentState;
  deployedUrl?: string | null;
  errorMessage?: string | null;
  deploymentMetadata?: any | null;
  deploymentTimestamp?: Date | null;
  aiModel?: string | null;
  isFavorite?: boolean;
  isArchived?: boolean;
}
