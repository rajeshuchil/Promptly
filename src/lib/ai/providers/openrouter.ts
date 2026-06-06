import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { AIProvider } from "./base";
import type {
  StructuredGenerationOptions,
  StreamingGenerationOptions,
  StreamChunk,
} from "../types";
import { AIError, AIErrorCode } from "../types";

export class OpenRouterProvider implements AIProvider {
  private static instance: OpenRouterProvider;
  private readonly apiKey: string;
  private readonly baseUrl = "https://openrouter.ai/api/v1";
  private readonly defaultModel = "meta-llama/llama-3.1-70b-instruct";

  private constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
  }

  static getInstance(): OpenRouterProvider {
    if (!OpenRouterProvider.instance) {
      OpenRouterProvider.instance = new OpenRouterProvider();
    }
    return OpenRouterProvider.instance;
  }

  private async validateResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body?.error?.message || "Unknown error from OpenRouter API";

      if (response.status === 401 || response.status === 403) {
        throw new AIError(message, AIErrorCode.INVALID_API_KEY, response.status);
      }
      if (response.status === 429) {
        throw new AIError(message, AIErrorCode.RATE_LIMIT_EXCEEDED, response.status);
      }
      if (response.status >= 500) {
        throw new AIError(message, AIErrorCode.PROVIDER_UNAVAILABLE, response.status);
      }
      throw new AIError(message, AIErrorCode.PROVIDER_ERROR, response.status);
    }
  }

  async generateText(
    prompt: string,
    options?: StructuredGenerationOptions
  ): Promise<string> {
    if (!this.apiKey) {
      throw new AIError("OPENROUTER_API_KEY not configured", AIErrorCode.INVALID_API_KEY, 500);
    }
    try {
      const model = options?.model || this.defaultModel;
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://fastapp.dev",
          "X-Title": "FastApp",
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
            { role: "user", content: prompt },
          ],
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1024,
        }),
      });

      await this.validateResponse(response);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `OpenRouter error: ${error instanceof Error ? error.message : String(error)}`,
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
    if (!this.apiKey) {
      throw new AIError("OPENROUTER_API_KEY not configured", AIErrorCode.INVALID_API_KEY, 500);
    }
    try {
      const model = options?.model || this.defaultModel;
      const jsonSchema = zodToJsonSchema(schema);

      // OpenRouter supports JSON mode for structured generation.
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://fastapp.dev",
          "X-Title": "FastApp",
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
            { role: "user", content: prompt + "\n\nYou must output a JSON object adhering to this schema:\n" + JSON.stringify(jsonSchema) },
          ],
          temperature: options?.temperature ?? 0,
          response_format: { type: "json_object" },
        }),
      });

      await this.validateResponse(response);
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const parsedData = JSON.parse(content);

      const validated = schema.safeParse(parsedData);
      if (!validated.success) {
        throw new AIError(
          `OpenRouter structured response failed schema validation: ${validated.error.message}`,
          AIErrorCode.INVALID_SCHEMA,
          400,
          validated.error
        );
      }
      return validated.data;
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `OpenRouter structured error: ${error instanceof Error ? error.message : String(error)}`,
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
    if (!this.apiKey) {
      throw new AIError("OPENROUTER_API_KEY not configured", AIErrorCode.INVALID_API_KEY, 500);
    }
    try {
      const model = options?.model || this.defaultModel;
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://fastapp.dev",
          "X-Title": "FastApp",
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
            { role: "user", content: prompt },
          ],
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 2048,
          stream: true,
        }),
      });

      await this.validateResponse(response);

      if (!response.body) {
        throw new AIError("No streamable body from OpenRouter API", AIErrorCode.PROVIDER_ERROR, 500);
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
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const jsonText = trimmed.slice(6);
            if (jsonText === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonText);
              const text = parsed.choices?.[0]?.delta?.content || "";
              if (text) {
                options?.onChunk?.(text);
                yield { text, index: chunkIndex++ };
              }
            } catch {}
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `OpenRouter stream error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 5,
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
