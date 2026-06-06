import type { AIProvider } from "./base";
import { RoutingProvider } from "./routing-provider";
import { GeminiProvider } from "./gemini";

export type ProviderType = "gemini" | "openai" | "anthropic" | "openrouter";

export function getProvider(): AIProvider {
  return new RoutingProvider();
}

export function getGeminiProvider(): GeminiProvider {
  return GeminiProvider.getInstance();
}
