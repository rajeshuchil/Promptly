import type { AIProvider } from "./base";
import { GeminiProvider } from "./gemini";

export type ProviderType = "gemini" | "openai" | "anthropic";

export function getProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || "gemini") as ProviderType;

  switch (providerType) {
    case "gemini":
      return GeminiProvider.getInstance();

    case "openai":
      throw new Error(
        "OpenAI provider not yet implemented. Set AI_PROVIDER=gemini"
      );

    case "anthropic":
      throw new Error(
        "Anthropic provider not yet implemented. Set AI_PROVIDER=gemini"
      );

    default:
      throw new Error(
        `Unknown AI_PROVIDER: ${providerType}. Supported: gemini, openai, anthropic`
      );
  }
}

export function getGeminiProvider(): GeminiProvider {
  return GeminiProvider.getInstance();
}
