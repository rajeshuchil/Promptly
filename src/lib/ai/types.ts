export enum AIErrorCode {
  INVALID_SCHEMA = "AI_INVALID_SCHEMA",
  INVALID_INPUT = "AI_INVALID_INPUT",
  PROVIDER_UNAVAILABLE = "AI_PROVIDER_UNAVAILABLE",
  PROVIDER_ERROR = "AI_PROVIDER_ERROR",
  RATE_LIMIT_EXCEEDED = "AI_RATE_LIMIT_EXCEEDED",
  INVALID_API_KEY = "AI_INVALID_API_KEY",
  MODEL_NOT_FOUND = "AI_MODEL_NOT_FOUND",
  PERSISTENCE_ERROR = "PERSISTENCE_ERROR",
  NOT_FOUND = "NOT_FOUND",
}

export class AIError extends Error {
  public readonly code: AIErrorCode;
  public readonly statusCode: number;
  public readonly cause?: unknown;

  constructor(
    message: string,
    code: AIErrorCode,
    statusCode: number = 500,
    cause?: unknown
  ) {
    super(message);
    this.name = "AIError";
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;

    Object.setPrototypeOf(this, AIError.prototype);
  }
}
export interface StructuredGenerationOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}
export interface StreamingGenerationOptions extends StructuredGenerationOptions {
  onChunk?: (chunk: string) => void;
}
export interface StreamChunk {
  text: string;
  index: number;
}
