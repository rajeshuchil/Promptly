import { z } from "zod";

// ─── Output validation schema ─────────────────────────────────────────────────

export const GeneratorOutputSchema = z
  .string()
  .min(200, "Generated HTML is too short to be a valid document (< 200 chars)")
  .max(120_000, "Generated HTML exceeds the maximum allowed size (120 000 chars)")
  .refine(
    (html) => /<html[\s>]/i.test(html) || /<!DOCTYPE/i.test(html),
    "Generated output is missing an <html> or <!DOCTYPE> root element"
  )
  .refine(
    (html) => /<\/html>/i.test(html),
    "Generated output is missing a closing </html> tag"
  )
  .refine(
    (html) => /<body[\s>]/i.test(html) && /<\/body>/i.test(html),
    "Generated output is missing a <body> element"
  )
  .refine(
    (html) => /<head[\s>]/i.test(html) && /<\/head>/i.test(html),
    "Generated output is missing a <head> element"
  )
  .refine(
    (html) => !/(^|\n)```/.test(html),
    "Generated output contains markdown code fences — the model leaked its formatting"
  );

export type ValidatedGeneratorOutput = z.infer<typeof GeneratorOutputSchema>;

export const GenerateRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt cannot be empty")
    .max(2000, "Prompt exceeds maximum length (2 000 characters)")
    .trim(),
  style: z
    .enum(["standard", "minimal", "rich"])
    .optional()
    .default("standard"),
  templateId: z.string().optional(),
  blueprintId: z.string().optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
