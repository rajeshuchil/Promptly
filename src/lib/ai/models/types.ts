export interface AIModelDetails {
  id: string; // The model ID (e.g., "gemini-2.5-flash", "gpt-4o")
  name: string; // Readable name
  provider: "gemini" | "openai" | "anthropic" | "openrouter" | "groq";
  capabilities: {
    structured: boolean;
    streaming: boolean;
    vision: boolean;
  };
  contextLength: number;
  maxOutputTokens: number;
  estimatedCostPerMillionInput: number; // USD
  estimatedCostPerMillionOutput: number; // USD
}
