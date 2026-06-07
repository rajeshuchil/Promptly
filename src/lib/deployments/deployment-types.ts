export type DeploymentStatus =
  | "idle"
  | "queued"
  | "building"
  | "deploying"
  | "deployed"
  | "failed";

export type DeploymentStepStatus = "pending" | "running" | "completed" | "failed";

export interface DeploymentStep {
  name: string;
  status: DeploymentStepStatus;
  message: string;
  url?: string;
}

export interface DeploymentRecord {
  id: string;
  projectId: string;
  providerName: string;
  status: DeploymentStatus;
  url?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  steps?: DeploymentStep[];
  errorMessage?: string | null;
}

export interface DeploymentResult {
  success: boolean;
  url?: string;
  providerDeploymentId?: string;
  metadata?: Record<string, any>;
  error?: string;
}
