import type { Plan } from "../planner/schemas";

export interface GeneratorInput {
  prompt: string;
  plan: Plan;
}

export interface GeneratorOutput {
  html: string;
  meta: GenerationMeta;
}

export interface GenerationMeta {
  model: string;
  promptStyle: GeneratorPromptStyle;
  durationMs: number;
  outputLength: number;
  generatedAt: string;
}

export type GeneratorPromptStyle = "standard" | "minimal" | "rich" | "modern-saas" | "glassmorphism" | "enterprise" | "startup";

export interface GeneratorOptions {
  style?: GeneratorPromptStyle;
  maxTokens?: number;
  temperature?: number;
  userId?: string;
}
