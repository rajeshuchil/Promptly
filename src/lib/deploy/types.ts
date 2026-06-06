export type DeploymentStatus = "idle" | "deploying" | "deployed" | "failed";

export interface DeployStep {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  message: string;
}

export interface DeploymentResult {
  projectId: string;
  deployedUrl: string;
  deployedAt: string;
}
