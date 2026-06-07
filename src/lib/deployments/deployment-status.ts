import { DeploymentStatus } from "./deployment-types";

/**
 * Valid state transitions for deployments.
 */
export const VALID_TRANSITIONS: Record<DeploymentStatus, DeploymentStatus[]> = {
  idle: ["queued", "failed"],
  queued: ["building", "failed"],
  building: ["deploying", "failed"],
  deploying: ["deployed", "failed"],
  deployed: ["queued", "deploying", "failed"], // allow redeploying
  failed: ["queued", "deploying"], // allow retry
};

/**
 * Check if a state transition is valid.
 */
export function isValidTransition(from: DeploymentStatus, to: DeploymentStatus): boolean {
  // Always allow transition to the same status (no-op)
  if (from === to) return true;

  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

/**
 * Helper to determine if status is terminal.
 */
export function isTerminalStatus(status: DeploymentStatus): boolean {
  return status === "deployed" || status === "failed";
}

/**
 * Helper to determine if status represents an active build/deployment.
 */
export function isActiveStatus(status: DeploymentStatus): boolean {
  return status === "queued" || status === "building" || status === "deploying";
}
