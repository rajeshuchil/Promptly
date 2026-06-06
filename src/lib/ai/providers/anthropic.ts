import { z } from "zod";
import type { AIProvider } from "./base";
import type {
  StructuredGenerationOptions,
  StreamingGenerationOptions,
  StreamChunk,
} from "../types";
import { AIError, AIErrorCode } from "../types";

export class AnthropicProvider implements AIProvider {
  private static instance: AnthropicProvider;
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.anthropic.com/v1";
  private readonly defaultModel = "claude-3-5-sonnet-20241022";

  private constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";
  }

  static getInstance(): AnthropicProvider {
    if (!AnthropicProvider.instance) {
      AnthropicProvider.instance = new AnthropicProvider();
    }
    return AnthropicProvider.instance;
  }

  private async validateResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body?.error?.message || "Unknown error from Anthropic API";

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
      throw new AIError("ANTHROPIC_API_KEY not configured", AIErrorCode.INVALID_API_KEY, 500);
    }
    try {
      const model = options?.model || this.defaultModel;
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          system: options?.systemPrompt,
          messages: [{ role: "user", content: prompt }],
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1024,
        }),
      });

      await this.validateResponse(response);
      const data = await response.json();
      return data.content?.[0]?.text || "";
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Anthropic error: ${error instanceof Error ? error.message : String(error)}`,
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
    // Anthropic does not support native json_schema response formats directly,
    // so we request JSON block in prompt and parse/validate.
    const systemPrompt =
      (options?.systemPrompt ? options.systemPrompt + "\n\n" : "") +
      "You must return response in raw JSON format matching this JSON schema:\n" +
      JSON.stringify(schema) +
      "\nDo not wrap output in HTML blocks. Output must be valid, parseable JSON.";

    try {
      const rawText = await this.generateText(prompt, {
        ...options,
        systemPrompt,
      });

      const trimmed = rawText.trim();
      const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
      const jsonText = fenced ? fenced[1] : trimmed;
      const parsedData = JSON.parse(jsonText);

      const validated = schema.safeParse(parsedData);
      if (!validated.success) {
        throw new AIError(
          `Anthropic structured response failed schema validation: ${validated.error.message}`,
          AIErrorCode.INVALID_SCHEMA,
          400,
          validated.error
        );
      }
      return validated.data;
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Anthropic structured error: ${error instanceof Error ? error.message : String(error)}`,
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
      throw new AIError("ANTHROPIC_API_KEY not configured", AIErrorCode.INVALID_API_KEY, 500);
    }
    try {
      const model = options?.model || this.defaultModel;
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          system: options?.systemPrompt,
          messages: [{ role: "user", content: prompt }],
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 2048,
          stream: true,
        }),
      });

      await this.validateResponse(response);

      if (!response.body) {
        throw new AIError("No streamable body from Anthropic API", AIErrorCode.PROVIDER_ERROR, 500);
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
            try {
              const parsed = JSON.parse(jsonText);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                const text = parsed.delta.text;
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
        `Anthropic stream error: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
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
