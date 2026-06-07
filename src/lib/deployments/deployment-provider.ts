import { DeploymentStep, DeploymentResult } from "./deployment-types";

export interface DeploymentProvider {
  /**
   * Unique identifier of the deployment provider (e.g. 'vercel', 'netlify', 'mock').
   */
  getName(): string;

  /**
   * Trigger a progressive deployment flow and yield steps for status tracking.
   * Can yield terminal deployment result inside the last chunk.
   */
  deployStream(
    projectId: string,
    html: string,
    options?: Record<string, any>
  ): AsyncIterable<DeploymentStep & { result?: DeploymentResult }>;
}
