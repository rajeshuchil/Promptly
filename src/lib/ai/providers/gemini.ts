import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { AIProvider } from "./base";
import type {
  StructuredGenerationOptions,
  StreamingGenerationOptions,
  StreamChunk,
} from "../types";
import { AIError, AIErrorCode } from "../types";

const GeminiErrorResponseSchema = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
    status: z.string(),
  }),
});
const GeminiContentSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(
            z.object({
              text: z.string(),
            })
          ),
        }),
        finishReason: z.string().optional(),
      })
    )
    .min(1),
});
const GeminiStreamChunkSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(
            z.object({
              text: z.string().optional(),
            })
          ),
        }),
      })
    )
    .optional(),
});

export class GeminiProvider implements AIProvider {
  private static instance: GeminiProvider;
  private readonly apiKey: string;
  private readonly baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  private readonly model = "gemini-2.5-flash";

  private constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || "";
    if (!this.apiKey) {
      throw new AIError(
        "GOOGLE_API_KEY environment variable is not set",
        AIErrorCode.INVALID_API_KEY,
        500
      );
    }
  }

  static getInstance(): GeminiProvider {
    if (!GeminiProvider.instance) {
      GeminiProvider.instance = new GeminiProvider();
    }
    return GeminiProvider.instance;
  }
  private async validateResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));

      const errorSchema = GeminiErrorResponseSchema.safeParse(body);
      const message = errorSchema.success
        ? errorSchema.data.error.message
        : "Unknown error from Gemini API";

      if (response.status === 401 || response.status === 403) {
        throw new AIError(message, AIErrorCode.INVALID_API_KEY, response.status);
      }

      if (response.status === 429) {
        throw new AIError(
          message,
          AIErrorCode.RATE_LIMIT_EXCEEDED,
          response.status
        );
      }

      if (response.status >= 500) {
        throw new AIError(
          message,
          AIErrorCode.PROVIDER_UNAVAILABLE,
          response.status
        );
      }

      throw new AIError(message, AIErrorCode.PROVIDER_ERROR, response.status);
    }
  }

  private toJsonSchema(schema: z.ZodSchema<unknown>): Record<string, unknown> {
    const jsonSchema = zodToJsonSchema(schema as z.ZodTypeAny, "Schema");
    return jsonSchema as Record<string, unknown>;
  }

  private parseJsonContent(rawText: string): unknown {
    const trimmed = rawText.trim();
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const payload = fenced ? fenced[1] : trimmed;
    return JSON.parse(payload);
  }

  async generateText(
    prompt: string,
    options?: StructuredGenerationOptions
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: options?.temperature ?? 0.7,
              maxOutputTokens: options?.maxTokens ?? 1024,
            },
            systemInstruction: options?.systemPrompt
              ? { parts: [{ text: options.systemPrompt }] }
              : undefined,
          }),
        }
      );

      await this.validateResponse(response);

      const data = await response.json();
      const parsed = GeminiContentSchema.safeParse(data);

      if (!parsed.success) {
        throw new AIError(
          "Invalid response format from Gemini API",
          AIErrorCode.PROVIDER_ERROR,
          500,
          parsed.error
        );
      }

      const text = parsed.data.candidates[0]?.content.parts[0]?.text || "";
      return text;
    } catch (error) {
      if (error instanceof AIError) {
        throw error;
      }

      throw new AIError(
        `Gemini API error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }

  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: StructuredGenerationOptions
  ): Promise<T> {
    try {
      const jsonSchema = this.toJsonSchema(schema);

      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseSchema: jsonSchema,
              responseMimeType: "application/json",
              temperature: options?.temperature ?? 0,
              maxOutputTokens: options?.maxTokens ?? 4096,
            },
            systemInstruction: options?.systemPrompt
              ? { parts: [{ text: options.systemPrompt }] }
              : undefined,
          }),
        }
      );

      await this.validateResponse(response);

      const data = await response.json();
      const parsed = GeminiContentSchema.safeParse(data);

      if (!parsed.success) {
        throw new AIError(
          "Invalid response format from Gemini API",
          AIErrorCode.PROVIDER_ERROR,
          500,
          parsed.error
        );
      }

      const jsonText = parsed.data.candidates[0]?.content.parts[0]?.text || "{}";
      let jsonData: unknown;

      try {
        jsonData = this.parseJsonContent(jsonText);
      } catch (parseError) {
        throw new AIError(
          "Generated content is not valid JSON",
          AIErrorCode.INVALID_SCHEMA,
          400,
          parseError
        );
      }

      const validated = schema.safeParse(jsonData);
      if (!validated.success) {
        throw new AIError(
          `Generated content failed schema validation: ${validated.error.message}`,
          AIErrorCode.INVALID_SCHEMA,
          400,
          validated.error
        );
      }

      return validated.data;
    } catch (error) {
      if (error instanceof AIError) {
        throw error;
      }

      throw new AIError(
        `Gemini structured generation error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }

  async *streamText(
    prompt: string,
    options?: StreamingGenerationOptions
  ): AsyncIterable<StreamChunk> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: options?.temperature ?? 0.7,
              maxOutputTokens: options?.maxTokens ?? 2048,
            },
            systemInstruction: options?.systemPrompt
              ? { parts: [{ text: options.systemPrompt }] }
              : undefined,
          }),
        }
      );

      await this.validateResponse(response);

      if (!response.body) {
        throw new AIError(
          "No response body from Gemini API",
          AIErrorCode.PROVIDER_ERROR,
          500
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunkIndex = 0;
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonText = line.slice(6);
                if (jsonText === "[DONE]") {
                  continue;
                }
                const data = JSON.parse(jsonText);

                const parsed = GeminiStreamChunkSchema.safeParse(data);
                if (parsed.success && parsed.data.candidates?.[0]) {
                  const text =
                    parsed.data.candidates[0].content.parts[0]?.text || "";
                  if (text) {
                    options?.onChunk?.(text);
                    yield {
                      text,
                      index: chunkIndex++,
                    };
                  }
                }
              } catch {}
            }
          }
        }

        if (buffer.startsWith("data: ")) {
          try {
            const jsonText = buffer.slice(6);
            if (jsonText !== "[DONE]") {
            const data = JSON.parse(jsonText);
            const parsed = GeminiStreamChunkSchema.safeParse(data);
            if (parsed.success && parsed.data.candidates?.[0]) {
              const text = parsed.data.candidates[0].content.parts[0]?.text || "";
              if (text) {
                options?.onChunk?.(text);
                yield {
                  text,
                  index: chunkIndex++,
                };
              }
            }
            }
          } catch {
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof AIError) {
        throw error;
      }

      throw new AIError(
        `Gemini streaming error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: "ping" }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 10,
            },
          }),
        }
      );

      return response.ok;
    } catch {
      return false;
    }
  }
}
