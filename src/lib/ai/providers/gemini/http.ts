import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { AIError, AIErrorCode } from "../../types";
import { GeminiErrorResponseSchema } from "./schemas";

/** Parse JSON from raw text, stripping optional fenced code blocks. */
export function parseJsonContent(rawText: string): unknown {
  const trimmed = rawText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

/** Convert a Zod schema to a plain JSON Schema object for Gemini's API. */
export function toJsonSchema(schema: z.ZodSchema<unknown>): Record<string, unknown> {
  return zodToJsonSchema(schema as z.ZodTypeAny, "Schema") as Record<string, unknown>;
}

/** Validate an HTTP Response from Gemini and throw a typed AIError on failure. */
export async function validateGeminiResponse(response: Response): Promise<void> {
  if (response.ok) return;

  const body = await response.json().catch(() => ({}));
  const parsed = GeminiErrorResponseSchema.safeParse(body);
  const message = parsed.success ? parsed.data.error.message : "Unknown error from Gemini API";

  if (response.status === 401 || response.status === 403)
    throw new AIError(message, AIErrorCode.INVALID_API_KEY, response.status);
  if (response.status === 429)
    throw new AIError(message, AIErrorCode.RATE_LIMIT_EXCEEDED, response.status);
  if (response.status >= 500)
    throw new AIError(message, AIErrorCode.PROVIDER_UNAVAILABLE, response.status);

  throw new AIError(message, AIErrorCode.PROVIDER_ERROR, response.status);
}
