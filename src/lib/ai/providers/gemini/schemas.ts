import { z } from "zod";

/** Gemini non-streaming response body schema. */
export const GeminiErrorResponseSchema = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
    status: z.string(),
  }),
});

export const GeminiContentSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(z.object({ text: z.string() })),
        }),
        finishReason: z.string().optional(),
      })
    )
    .min(1),
});

/** Gemini SSE streaming chunk schema. */
export const GeminiStreamChunkSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(z.object({ text: z.string().optional() })),
        }),
      })
    )
    .optional(),
});

export type GeminiErrorResponse = z.infer<typeof GeminiErrorResponseSchema>;
export type GeminiContent = z.infer<typeof GeminiContentSchema>;
export type GeminiStreamChunk = z.infer<typeof GeminiStreamChunkSchema>;
