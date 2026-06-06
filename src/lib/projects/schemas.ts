import { z } from "zod";

export const CreateProjectSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  prompt: z.string().min(1),
  generatedHtml: z.string().optional(),
  generatedCss: z.string().optional(),
  deploymentState: z.enum(["idle", "generating", "generated", "deploying", "deployed", "failed"]).optional(),
  aiModel: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  prompt: z.string().min(1).optional(),
  generatedHtml: z.string().optional(),
  generatedCss: z.string().optional(),
  deploymentState: z.enum(["idle", "generating", "generated", "deploying", "deployed", "failed"]).optional(),
  deployedUrl: z.string().url().optional().or(z.literal("")),
  errorMessage: z.string().optional(),
  aiModel: z.string().optional(),
  isArchived: z.boolean().optional(),
});
