import { z } from "zod";
import type {
  StructuredGenerationOptions,
  StreamingGenerationOptions,
  StreamChunk,
} from "../types";

export interface AIProvider {
  generateText(
    prompt: string,
    options?: StructuredGenerationOptions
  ): Promise<string>;
  generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: StructuredGenerationOptions
  ): Promise<T>;
  streamText(
    prompt: string,
    options?: StreamingGenerationOptions
  ): AsyncIterable<StreamChunk>;
  isHealthy(): Promise<boolean>;
}
