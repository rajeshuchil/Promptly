import { z } from "zod";
import type { AIProvider } from "./base";
import type {
  StructuredGenerationOptions,
  StreamingGenerationOptions,
  StreamChunk,
} from "../types";
import { ProviderRegistry } from "./registry";
import { ModelRouter } from "../router";
import { UsageService } from "@/lib/usage/usage-service";

export class RoutingProvider implements AIProvider {
  private registry = ProviderRegistry.getInstance();
  private router = ModelRouter.getInstance();
  private usageService = UsageService.getInstance();

  private getUsagePhase(options?: StructuredGenerationOptions): "planner" | "generator" | "validator" {
    // Determine phase based on max tokens or other options, fallback to generator
    if (options?.maxTokens === 4096) {
      return "planner";
    }
    return "generator";
  }

  async generateText(
    prompt: string,
    options?: StructuredGenerationOptions & { userId?: string; phase?: "planner" | "generator" | "validator" }
  ): Promise<string> {
    const phase = options?.phase ?? this.getUsagePhase(options);
    const userId = options?.userId;
    const modelDetails = await this.router.route(userId, phase === "planner" ? "planner" : "generator");
    const provider = this.registry.getProvider(modelDetails.provider);

    const startMs = Date.now();
    try {
      const text = await provider.generateText(prompt, {
        ...options,
        model: modelDetails.id,
      });

      if (userId) {
        const promptTokens = Math.max(1, Math.round(prompt.length / 4));
        const completionTokens = Math.max(1, Math.round(text.length / 4));
        const totalTokens = promptTokens + completionTokens;
        const estimatedCost = (promptTokens * modelDetails.estimatedCostPerMillionInput +
                               completionTokens * modelDetails.estimatedCostPerMillionOutput) / 1000000;

        await this.usageService.recordUsage({
          userId,
          model: modelDetails.id,
          provider: modelDetails.provider,
          promptLength: prompt.length,
          outputLength: text.length,
          status: "success",
          phase,
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCost,
        }).catch(err => console.error("Failed to record usage in generateText:", err));
      }

      return text;
    } catch (error: any) {
      if (userId) {
        await this.usageService.recordUsage({
          userId,
          model: modelDetails.id,
          provider: modelDetails.provider,
          promptLength: prompt.length,
          outputLength: 0,
          status: "failed",
          phase,
          errorMessage: error.message || String(error),
        }).catch(err => console.error("Failed to record usage error in generateText:", err));
      }
      throw error;
    }
  }

  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: StructuredGenerationOptions & { userId?: string; phase?: "planner" | "generator" | "validator" }
  ): Promise<T> {
    const phase = options?.phase ?? "planner";
    const userId = options?.userId;
    const modelDetails = await this.router.route(userId, phase === "planner" ? "planner" : "generator");
    const provider = this.registry.getProvider(modelDetails.provider);

    try {
      const result = await provider.generateStructured(prompt, schema, {
        ...options,
        model: modelDetails.id,
      });

      if (userId) {
        const resultText = JSON.stringify(result);
        const promptTokens = Math.max(1, Math.round(prompt.length / 4));
        const completionTokens = Math.max(1, Math.round(resultText.length / 4));
        const totalTokens = promptTokens + completionTokens;
        const estimatedCost = (promptTokens * modelDetails.estimatedCostPerMillionInput +
                               completionTokens * modelDetails.estimatedCostPerMillionOutput) / 1000000;

        await this.usageService.recordUsage({
          userId,
          model: modelDetails.id,
          provider: modelDetails.provider,
          promptLength: prompt.length,
          outputLength: resultText.length,
          status: "success",
          phase,
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCost,
        }).catch(err => console.error("Failed to record usage in generateStructured:", err));
      }

      return result;
    } catch (error: any) {
      if (userId) {
        await this.usageService.recordUsage({
          userId,
          model: modelDetails.id,
          provider: modelDetails.provider,
          promptLength: prompt.length,
          outputLength: 0,
          status: "failed",
          phase,
          errorMessage: error.message || String(error),
        }).catch(err => console.error("Failed to record usage error in generateStructured:", err));
      }
      throw error;
    }
  }

  async *streamText(
    prompt: string,
    options?: StreamingGenerationOptions & { userId?: string; phase?: "planner" | "generator" | "validator" }
  ): AsyncIterable<StreamChunk> {
    const phase = options?.phase ?? "generator";
    const userId = options?.userId;
    const modelDetails = await this.router.route(userId, phase === "planner" ? "planner" : "generator");
    const provider = this.registry.getProvider(modelDetails.provider);

    const stream = provider.streamText(prompt, {
      ...options,
      model: modelDetails.id,
    });

    let accumulatedText = "";
    try {
      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        yield chunk;
      }

      if (userId) {
        const promptTokens = Math.max(1, Math.round(prompt.length / 4));
        const completionTokens = Math.max(1, Math.round(accumulatedText.length / 4));
        const totalTokens = promptTokens + completionTokens;
        const estimatedCost = (promptTokens * modelDetails.estimatedCostPerMillionInput +
                               completionTokens * modelDetails.estimatedCostPerMillionOutput) / 1000000;

        await this.usageService.recordUsage({
          userId,
          model: modelDetails.id,
          provider: modelDetails.provider,
          promptLength: prompt.length,
          outputLength: accumulatedText.length,
          status: "success",
          phase,
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCost,
        }).catch(err => console.error("Failed to record usage in streamText:", err));
      }
    } catch (error: any) {
      if (userId) {
        await this.usageService.recordUsage({
          userId,
          model: modelDetails.id,
          provider: modelDetails.provider,
          promptLength: prompt.length,
          outputLength: accumulatedText.length,
          status: "failed",
          phase,
          errorMessage: error.message || String(error),
        }).catch(err => console.error("Failed to record usage error in streamText:", err));
      }
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}
