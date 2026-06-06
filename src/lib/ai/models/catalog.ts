import type { AIModelDetails } from "./types";

export const MODEL_CATALOG: Record<string, AIModelDetails> = {
  // Gemini Models
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "gemini",
    capabilities: { structured: true, streaming: true, vision: true },
    contextLength: 1048576,
    maxOutputTokens: 8192,
    estimatedCostPerMillionInput: 0.075,
    estimatedCostPerMillionOutput: 0.3,
  },
  "gemini-2.5-pro": {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "gemini",
    capabilities: { structured: true, streaming: true, vision: true },
    contextLength: 2097152,
    maxOutputTokens: 8192,
    estimatedCostPerMillionInput: 1.25,
    estimatedCostPerMillionOutput: 5.0,
  },
  // OpenAI Models
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    capabilities: { structured: true, streaming: true, vision: true },
    contextLength: 128000,
    maxOutputTokens: 4096,
    estimatedCostPerMillionInput: 2.5,
    estimatedCostPerMillionOutput: 10.0,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    capabilities: { structured: true, streaming: true, vision: true },
    contextLength: 128000,
    maxOutputTokens: 16384,
    estimatedCostPerMillionInput: 0.15,
    estimatedCostPerMillionOutput: 0.6,
  },
  // Anthropic Models
  "claude-3-5-sonnet": {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    capabilities: { structured: true, streaming: true, vision: true },
    contextLength: 200000,
    maxOutputTokens: 8192,
    estimatedCostPerMillionInput: 3.0,
    estimatedCostPerMillionOutput: 15.0,
  },
  // OpenRouter Models
  "openrouter-llama-3": {
    id: "meta-llama/llama-3.1-70b-instruct",
    name: "Llama 3.1 70B (OpenRouter)",
    provider: "openrouter",
    capabilities: { structured: true, streaming: true, vision: false },
    contextLength: 131072,
    maxOutputTokens: 4096,
    estimatedCostPerMillionInput: 0.52,
    estimatedCostPerMillionOutput: 0.75,
  }
};
