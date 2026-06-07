import { z } from "zod";

export const EditRequestSchema = z.object({
  projectId: z.string().uuid("Invalid project ID format"),
  prompt: z
    .string()
    .min(1, "Prompt cannot be empty")
    .max(2000, "Prompt is too long (max 2 000 characters)")
    .trim(),
  style: z
    .enum(["standard", "minimal", "rich", "modern-saas", "glassmorphism", "enterprise", "startup"])
    .optional(),
  parentRevisionId: z.string().uuid().optional(),
});

export type EditRequest = z.infer<typeof EditRequestSchema>;
