import { z } from "zod";

export const CreateUsageInputSchema = z.object({
  userId: z.string().uuid(),
  projectId: z.string().uuid().nullable().optional(),
  model: z.string().min(1),
  provider: z.string().min(1),
  promptLength: z.number().int().nonnegative(),
  outputLength: z.number().int().nonnegative(),
  status: z.enum(["success", "failed"]),
  phase: z.enum(["planner", "generator", "validator"]),
  errorMessage: z.string().nullable().optional(),
});
