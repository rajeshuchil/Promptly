import type { AIProvider } from "./base";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { OpenRouterProvider } from "./openrouter";
import { GroqProvider } from "./groq";

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private registry = new Map<string, AIProvider>();

  private constructor() {
    // Register the core providers
    this.register("gemini", GeminiProvider.getInstance());
    this.register("openai", OpenAIProvider.getInstance());
    this.register("anthropic", AnthropicProvider.getInstance());
    this.register("openrouter", OpenRouterProvider.getInstance());
    this.register("groq", GroqProvider.getInstance());
  }

  static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  register(name: string, provider: AIProvider): void {
    this.registry.set(name, provider);
  }

  getProvider(name: string): AIProvider {
    const provider = this.registry.get(name);
    if (!provider) {
      throw new Error(`AI Provider '${name}' is not registered`);
    }
    return provider;
  }
}
