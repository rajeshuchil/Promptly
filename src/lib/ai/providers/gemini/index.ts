import { z } from "zod";
import type { AIProvider } from "../base";
import type {
  StructuredGenerationOptions,
  StreamingGenerationOptions,
  StreamChunk,
} from "../../types";
import { AIError, AIErrorCode } from "../../types";
import {
  GeminiContentSchema,
  GeminiStreamChunkSchema,
} from "./schemas";
import { validateGeminiResponse, parseJsonContent, toJsonSchema } from "./http";

export class GeminiProvider implements AIProvider {
  private static instance: GeminiProvider;
  private readonly apiKey: string;
  private readonly baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  private readonly defaultModel = "gemini-2.5-flash";

  private constructor() {
    this.apiKey = process.env.GEMINI_API_KEY ?? "";
  }

  static getInstance(): GeminiProvider {
    if (!GeminiProvider.instance) GeminiProvider.instance = new GeminiProvider();
    return GeminiProvider.instance;
  }

  async generateText(prompt: string, options?: StructuredGenerationOptions): Promise<string> {
    if (!this.apiKey) {
      throw new AIError(
        "GEMINI_API_KEY environment variable is not set",
        AIErrorCode.INVALID_API_KEY,
        500
      );
    }
    try {
      const model = options?.model ?? this.defaultModel;
      const response = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 8192,
          },
          systemInstruction: options?.systemPrompt
            ? { parts: [{ text: options.systemPrompt }] }
            : undefined,
        }),
      });

      await validateGeminiResponse(response);
      const data = await response.json();
      const parsed = GeminiContentSchema.safeParse(data);
      if (!parsed.success)
        throw new AIError("Invalid response format from Gemini API", AIErrorCode.PROVIDER_ERROR, 500, parsed.error);

      return parsed.data.candidates[0]?.content.parts[0]?.text ?? "";
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Gemini API error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR, 500, error
      );
    }
  }

  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: StructuredGenerationOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new AIError(
        "GEMINI_API_KEY environment variable is not set",
        AIErrorCode.INVALID_API_KEY,
        500
      );
    }
    try {
      const model = options?.model ?? this.defaultModel;
      const jsonSchema = toJsonSchema(schema);

      const response = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseSchema: jsonSchema,
            responseMimeType: "application/json",
            temperature: options?.temperature ?? 0,
            maxOutputTokens: options?.maxTokens ?? 8192,
          },
          systemInstruction: options?.systemPrompt
            ? { parts: [{ text: options.systemPrompt }] }
            : undefined,
        }),
      });

      await validateGeminiResponse(response);
      const data = await response.json();
      const parsed = GeminiContentSchema.safeParse(data);
      if (!parsed.success)
        throw new AIError("Invalid response format from Gemini API", AIErrorCode.PROVIDER_ERROR, 500, parsed.error);

      const jsonText = parsed.data.candidates[0]?.content.parts[0]?.text ?? "{}";
      let jsonData: unknown;
      try {
        jsonData = parseJsonContent(jsonText);
      } catch (parseError) {
        throw new AIError("Generated content is not valid JSON", AIErrorCode.INVALID_SCHEMA, 400, parseError);
      }

      const validated = schema.safeParse(jsonData);
      if (!validated.success)
        throw new AIError(`Generated content failed schema validation: ${validated.error.message}`, AIErrorCode.INVALID_SCHEMA, 400, validated.error);

      return validated.data;
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Gemini structured generation error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR, 500, error
      );
    }
  }

  async *streamText(prompt: string, options?: StreamingGenerationOptions): AsyncIterable<StreamChunk> {
    if (!this.apiKey) {
      throw new AIError(
        "GEMINI_API_KEY environment variable is not set",
        AIErrorCode.INVALID_API_KEY,
        500
      );
    }
    try {
      const model = options?.model ?? this.defaultModel;
      const response = await fetch(
        `${this.baseUrl}/${model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: options?.temperature ?? 0.7,
              maxOutputTokens: options?.maxTokens ?? 8192,
            },
            systemInstruction: options?.systemPrompt
              ? { parts: [{ text: options.systemPrompt }] }
              : undefined,
          }),
        }
      );

      await validateGeminiResponse(response);
      if (!response.body)
        throw new AIError("No response body from Gemini API", AIErrorCode.PROVIDER_ERROR, 500);

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
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const jsonText = line.slice(6);
              if (jsonText === "[DONE]") continue;
              const parsed = GeminiStreamChunkSchema.safeParse(JSON.parse(jsonText));
              if (parsed.success && parsed.data.candidates?.[0]) {
                const text = parsed.data.candidates[0].content.parts[0]?.text ?? "";
                if (text) {
                  options?.onChunk?.(text);
                  yield { text, index: chunkIndex++ };
                }
              }
            } catch { /* malformed SSE line — skip */ }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Gemini streaming error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR, 500, error
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.defaultModel}:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
