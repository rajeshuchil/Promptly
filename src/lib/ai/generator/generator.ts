import { getProvider } from "../providers/factory";
import { AIError, AIErrorCode } from "../types";
import { GeneratorOutputSchema } from "./schemas";
import {
  GENERATOR_SYSTEM_PROMPT,
  selectGeneratorPromptBuilder,
} from "./prompts";
import type { GeneratorInput, GeneratorOutput, GeneratorOptions } from "./types";
import { compileDesignSystemKnowledge } from "@/lib/design-system";


export class GeneratorService {
  private static instance: GeneratorService;
  private provider = getProvider();

  private constructor() { }

  static getInstance(): GeneratorService {
    if (!GeneratorService.instance) {
      GeneratorService.instance = new GeneratorService();
    }
    return GeneratorService.instance;
  }

  // ── Input guard ────────────────────────────────────────────────────────────

  private validateInput(input: GeneratorInput): void {
    if (!input.prompt || input.prompt.trim().length === 0) {
      throw new AIError(
        "Generator input prompt cannot be empty",
        AIErrorCode.INVALID_INPUT,
        400
      );
    }
    if (!input.plan) {
      throw new AIError(
        "Generator requires a structured Plan from the Planner — plan is missing",
        AIErrorCode.INVALID_INPUT,
        400
      );
    }
    if (!input.plan.sections || input.plan.sections.length === 0) {
      throw new AIError(
        "Plan must contain at least one section",
        AIErrorCode.INVALID_INPUT,
        400
      );
    }
  }

  // ── Output cleaner ─────────────────────────────────────────────────────────

  public cleanRawOutput(raw: string): string {
    let cleaned = raw.trim();

    // Strip leading/trailing ```html … ``` or ``` … ``` fences
    const fenceMatch = cleaned.match(/^```(?:html)?\s*([\s\S]*?)```\s*$/i);
    if (fenceMatch && fenceMatch[1]) {
      cleaned = fenceMatch[1].trim();
    }

    return cleaned;
  }

  // ── Output validator ───────────────────────────────────────────────────────

  private validateOutput(html: string): string {
    if (!html || html.trim().length === 0) {
      throw new AIError(
        "Generated HTML is empty",
        AIErrorCode.INVALID_SCHEMA,
        500
      );
    }
    return html;
  }

  // ── Core generation ────────────────────────────────────────────────────────

  async generate(
    input: GeneratorInput,
    options?: GeneratorOptions
  ): Promise<GeneratorOutput> {
    // 1. Validate input
    this.validateInput(input);

    const style = options?.style ?? "standard";
    const startMs = Date.now();

    // 2. Build prompt — plan is always injected
    const promptBuilder = selectGeneratorPromptBuilder(style);
    const userMessage = promptBuilder(input.prompt, input.plan);

    // 3. Call provider
    let rawHtml: string;
    try {
      rawHtml = await this.provider.generateText(userMessage, {
        systemPrompt: `${GENERATOR_SYSTEM_PROMPT}\n\n${compileDesignSystemKnowledge()}`,
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens ?? 16_384,
        userId: options?.userId,
        phase: "generator",
      });
    } catch (error) {
      if (error instanceof AIError) throw error;

      throw new AIError(
        `Generator provider call failed: ${error instanceof Error ? error.message : String(error)
        }`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }

    // 4. Clean raw output
    const cleaned = this.cleanRawOutput(rawHtml);

    // 5. Basic sanity validation (detailed validation is delegated to the Validator service)
    const validatedHtml = this.validateOutput(cleaned);

    const durationMs = Date.now() - startMs;

    return {
      html: validatedHtml,
      meta: {
        model: "gemini-2.5-flash",
        promptStyle: style,
        durationMs,
        outputLength: validatedHtml.length,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Stream the generated HTML content progressively.
   */
  async *stream(
    input: GeneratorInput,
    options?: GeneratorOptions
  ): AsyncIterable<string> {
    this.validateInput(input);

    const style = options?.style ?? "standard";
    const promptBuilder = selectGeneratorPromptBuilder(style);
    const userMessage = promptBuilder(input.prompt, input.plan);

    try {
      const stream = this.provider.streamText(userMessage, {
        systemPrompt: `${GENERATOR_SYSTEM_PROMPT}\n\n${compileDesignSystemKnowledge()}`,
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens ?? 16_384,
        userId: options?.userId,
        phase: "generator",
      });

      for await (const chunk of stream) {
        yield chunk.text;
      }
    } catch (error) {
      if (error instanceof AIError) throw error;

      throw new AIError(
        `Generator streaming failed: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }


  // ── Generation with retry ──────────────────────────────────────────────────

  async generateWithRetry(
    input: GeneratorInput,
    maxRetries: number = 2,
    options?: GeneratorOptions
  ): Promise<GeneratorOutput> {
    let lastError: AIError | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.generate(input, options);
      } catch (error) {
        lastError = error instanceof AIError ? error : null;

        // Non-retryable — surface immediately
        if (
          lastError?.code === AIErrorCode.INVALID_INPUT ||
          lastError?.code === AIErrorCode.INVALID_SCHEMA
        ) {
          throw error;
        }

        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s …
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1_000)
          );
        }
      }
    }

    throw (
      lastError ??
      new AIError(
        "Generator failed after all retries",
        AIErrorCode.PROVIDER_ERROR,
        500
      )
    );
  }

  async isHealthy(): Promise<boolean> {
    try {
      return await this.provider.isHealthy();
    } catch {
      return false;
    }
  }
}
