import { z } from "zod";

export const DeployInputSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  providerName: z.string().optional().default("mock"),
});

export const DeploymentStepSchema = z.object({
  name: z.string(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  message: z.string(),
  url: z.string().url().optional(),
});

export const DeploymentRecordSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  providerName: z.string(),
  status: z.enum(["idle", "queued", "building", "deploying", "deployed", "failed"]),
  url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string(),
  steps: z.array(DeploymentStepSchema).optional(),
  errorMessage: z.string().nullable().optional(),
});

export const DeploymentMetadataSchema = z.object({
  current: DeploymentRecordSchema.nullable().optional(),
  history: z.array(DeploymentRecordSchema).optional().default([]),
});

export type DeployInput = z.infer<typeof DeployInputSchema>;
export type DeploymentMetadata = z.infer<typeof DeploymentMetadataSchema>;
