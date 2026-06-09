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
      console.warn(`[RoutingProvider] Primary provider ${modelDetails.provider} failed generateText. Error: ${error.message || error}`);
      
      let fallbackSuccess = false;
      let textResult = "";

      // 1. Try OpenRouter fallback
      if (modelDetails.provider === "groq" || modelDetails.provider === "gemini") {
        if (options?.onFallback) {
          options.onFallback("Primary model temporarily unavailable. Switching to backup model...");
        }

        const openrouterProvider = this.registry.getProvider("openrouter");
        const fallbackModels = [
          "meta-llama/llama-3.3-70b-instruct:free",
          "google/gemma-4-31b-it:free",
          "openrouter/free",
        ];

        for (const fallbackModel of fallbackModels) {
          try {
            console.log(`[RoutingProvider] Attempting OpenRouter fallback with model: ${fallbackModel}`);
            const text = await openrouterProvider.generateText(prompt, {
              ...options,
              model: fallbackModel,
            });

            if (userId) {
              const promptTokens = Math.max(1, Math.round(prompt.length / 4));
              const completionTokens = Math.max(1, Math.round(text.length / 4));
              const totalTokens = promptTokens + completionTokens;

              await this.usageService.recordUsage({
                userId,
                model: fallbackModel,
                provider: "openrouter",
                promptLength: prompt.length,
                outputLength: text.length,
                status: "success",
                phase,
                promptTokens,
                completionTokens,
                totalTokens,
                estimatedCost: 0,
              }).catch(err => console.error("Failed to record fallback usage in generateText:", err));
            }

            textResult = text;
            fallbackSuccess = true;
            break;
          } catch (fallbackError: any) {
            console.error(`[RoutingProvider] OpenRouter fallback model ${fallbackModel} failed:`, fallbackError.message || fallbackError);
          }
        }
      }

      // 2. Try Gemini fallback if OpenRouter failed and primary wasn't Gemini
      if (!fallbackSuccess && modelDetails.provider !== "gemini") {
        try {
          console.log(`[RoutingProvider] Attempting Gemini fallback with model: gemini-2.5-flash`);
          const geminiProvider = this.registry.getProvider("gemini");
          const text = await geminiProvider.generateText(prompt, {
            ...options,
            model: "gemini-2.5-flash",
          });

          if (userId) {
            const promptTokens = Math.max(1, Math.round(prompt.length / 4));
            const completionTokens = Math.max(1, Math.round(text.length / 4));
            const totalTokens = promptTokens + completionTokens;

            await this.usageService.recordUsage({
              userId,
              model: "gemini-2.5-flash",
              provider: "gemini",
              promptLength: prompt.length,
              outputLength: text.length,
              status: "success",
              phase,
              promptTokens,
              completionTokens,
              totalTokens,
              estimatedCost: 0,
            }).catch(err => console.error("Failed to record fallback usage in generateText:", err));
          }

          textResult = text;
          fallbackSuccess = true;
        } catch (geminiError: any) {
          console.error(`[RoutingProvider] Gemini fallback failed:`, geminiError.message || geminiError);
        }
      }

      if (fallbackSuccess) {
        return textResult;
      }

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
      console.warn(`[RoutingProvider] Primary provider ${modelDetails.provider} failed generateStructured. Error: ${error.message || error}`);
      
      let fallbackSuccess = false;
      let structResult: T | null = null;

      // 1. Try OpenRouter fallback
      if (modelDetails.provider === "groq" || modelDetails.provider === "gemini") {
        if (options?.onFallback) {
          options.onFallback("Primary model temporarily unavailable. Switching to backup model...");
        }

        const openrouterProvider = this.registry.getProvider("openrouter");
        const fallbackModels = [
          "meta-llama/llama-3.3-70b-instruct:free",
          "google/gemma-4-31b-it:free",
          "openrouter/free",
        ];

        for (const fallbackModel of fallbackModels) {
          try {
            console.log(`[RoutingProvider] Attempting OpenRouter structured fallback with model: ${fallbackModel}`);
            const result = await openrouterProvider.generateStructured(prompt, schema, {
              ...options,
              model: fallbackModel,
            });

            if (userId) {
              const resultText = JSON.stringify(result);
              const promptTokens = Math.max(1, Math.round(prompt.length / 4));
              const completionTokens = Math.max(1, Math.round(resultText.length / 4));
              const totalTokens = promptTokens + completionTokens;

              await this.usageService.recordUsage({
                userId,
                model: fallbackModel,
                provider: "openrouter",
                promptLength: prompt.length,
                outputLength: resultText.length,
                status: "success",
                phase,
                promptTokens,
                completionTokens,
                totalTokens,
                estimatedCost: 0,
              }).catch(err => console.error("Failed to record fallback usage in generateStructured:", err));
            }

            structResult = result;
            fallbackSuccess = true;
            break;
          } catch (fallbackError: any) {
            console.error(`[RoutingProvider] OpenRouter structured fallback model ${fallbackModel} failed:`, fallbackError.message || fallbackError);
          }
        }
      }

      // 2. Try Gemini fallback if OpenRouter failed and primary wasn't Gemini
      if (!fallbackSuccess && modelDetails.provider !== "gemini") {
        try {
          console.log(`[RoutingProvider] Attempting Gemini structured fallback with model: gemini-2.5-flash`);
          const geminiProvider = this.registry.getProvider("gemini");
          const result = await geminiProvider.generateStructured(prompt, schema, {
            ...options,
            model: "gemini-2.5-flash",
          });

          if (userId) {
            const resultText = JSON.stringify(result);
            const promptTokens = Math.max(1, Math.round(prompt.length / 4));
            const completionTokens = Math.max(1, Math.round(resultText.length / 4));
            const totalTokens = promptTokens + completionTokens;

            await this.usageService.recordUsage({
              userId,
              model: "gemini-2.5-flash",
              provider: "gemini",
              promptLength: prompt.length,
              outputLength: resultText.length,
              status: "success",
              phase,
              promptTokens,
              completionTokens,
              totalTokens,
              estimatedCost: 0,
            }).catch(err => console.error("Failed to record fallback usage in generateStructured:", err));
          }

          structResult = result;
          fallbackSuccess = true;
        } catch (geminiError: any) {
          console.error(`[RoutingProvider] Gemini structured fallback failed:`, geminiError.message || geminiError);
        }
      }

      if (fallbackSuccess && structResult !== null) {
        return structResult;
      }

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

    let accumulatedText = "";
    try {
      const stream = provider.streamText(prompt, {
        ...options,
        model: modelDetails.id,
      });

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
      console.warn(`[RoutingProvider] Primary provider ${modelDetails.provider} failed streamText. Error: ${error.message || error}`);
      
      let fallbackSuccess = false;

      // 1. Try OpenRouter fallback
      if (modelDetails.provider === "groq" || modelDetails.provider === "gemini") {
        if (options?.onFallback) {
          options.onFallback("Primary model temporarily unavailable. Switching to backup model...");
        }

        const openrouterProvider = this.registry.getProvider("openrouter");
        const fallbackModels = [
          "meta-llama/llama-3.3-70b-instruct:free",
          "google/gemma-4-31b-it:free",
          "openrouter/free",
        ];

        for (const fallbackModel of fallbackModels) {
          try {
            console.log(`[RoutingProvider] Attempting OpenRouter streaming fallback with model: ${fallbackModel}`);
            const fallbackStream = openrouterProvider.streamText(prompt, {
              ...options,
              model: fallbackModel,
            });

            let fallbackAccumulatedText = "";
            for await (const chunk of fallbackStream) {
              fallbackAccumulatedText += chunk.text;
              yield chunk;
            }

            if (userId) {
              const promptTokens = Math.max(1, Math.round(prompt.length / 4));
              const completionTokens = Math.max(1, Math.round(fallbackAccumulatedText.length / 4));
              const totalTokens = promptTokens + completionTokens;

              await this.usageService.recordUsage({
                userId,
                model: fallbackModel,
                provider: "openrouter",
                promptLength: prompt.length,
                outputLength: fallbackAccumulatedText.length,
                status: "success",
                phase,
                promptTokens,
                completionTokens,
                totalTokens,
                estimatedCost: 0,
              }).catch(err => console.error("Failed to record fallback usage in streamText:", err));
            }

            fallbackSuccess = true;
            break;
          } catch (fallbackError: any) {
            console.error(`[RoutingProvider] OpenRouter streaming fallback model ${fallbackModel} failed:`, fallbackError.message || fallbackError);
          }
        }
      }

      // 2. Try Gemini fallback if OpenRouter failed and primary wasn't Gemini
      if (!fallbackSuccess && modelDetails.provider !== "gemini") {
        try {
          console.log(`[RoutingProvider] Attempting Gemini streaming fallback with model: gemini-2.5-flash`);
          const geminiProvider = this.registry.getProvider("gemini");
          const fallbackStream = geminiProvider.streamText(prompt, {
            ...options,
            model: "gemini-2.5-flash",
          });

          let fallbackAccumulatedText = "";
          for await (const chunk of fallbackStream) {
            fallbackAccumulatedText += chunk.text;
            yield chunk;
          }

          if (userId) {
            const promptTokens = Math.max(1, Math.round(prompt.length / 4));
            const completionTokens = Math.max(1, Math.round(fallbackAccumulatedText.length / 4));
            const totalTokens = promptTokens + completionTokens;

            await this.usageService.recordUsage({
              userId,
              model: "gemini-2.5-flash",
              provider: "gemini",
              promptLength: prompt.length,
              outputLength: fallbackAccumulatedText.length,
              status: "success",
              phase,
              promptTokens,
              completionTokens,
              totalTokens,
              estimatedCost: 0,
            }).catch(err => console.error("Failed to record fallback usage in streamText:", err));
          }

          fallbackSuccess = true;
        } catch (geminiError: any) {
          console.error(`[RoutingProvider] Gemini streaming fallback failed:`, geminiError.message || geminiError);
        }
      }

      if (fallbackSuccess) {
        return;
      }

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
