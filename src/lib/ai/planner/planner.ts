import { getProvider } from "../providers/factory";
import { PlanSchema, type Plan } from "./schemas";
import {
  PLANNER_SYSTEM_PROMPT,
  buildPlannerUserPrompt,
  buildCreativePlannerPrompt,
  buildAccessiblePlannerPrompt,
} from "./prompts";
import { AIError, AIErrorCode } from "../types";

export type PlannerStyle = "default" | "creative" | "accessible";

export interface PlanGenerationOptions {
  style?: PlannerStyle;
  userId?: string;
  projectId?: string;
}

export class PlannerService {
  private static instance: PlannerService;
  private provider = getProvider();

  private constructor() {}

  static getInstance(): PlannerService {
    if (!PlannerService.instance) {
      PlannerService.instance = new PlannerService();
    }
    return PlannerService.instance;
  }

  private selectPromptBuilder(
    style: PlannerStyle
  ): (prompt: string) => string {
    switch (style) {
      case "creative":
        return buildCreativePlannerPrompt;
      case "accessible":
        return buildAccessiblePlannerPrompt;
      case "default":
      default:
        return buildPlannerUserPrompt;
    }
  }

  async generatePlan(
    userPrompt: string,
    options?: PlanGenerationOptions
  ): Promise<Plan> {
    if (!userPrompt || userPrompt.trim().length === 0) {
      throw new AIError(
        "User prompt cannot be empty",
        AIErrorCode.INVALID_INPUT,
        400
      );
    }

    if (userPrompt.length > 2000) {
      throw new AIError(
        "User prompt exceeds maximum length (2000 characters)",
        AIErrorCode.INVALID_INPUT,
        400
      );
    }

    const style = options?.style || "default";
    const promptBuilder = this.selectPromptBuilder(style);
    const userMessage = promptBuilder(userPrompt);

    try {
      const plan = await this.provider.generateStructured(
        userMessage,
        PlanSchema,
        {
          systemPrompt: PLANNER_SYSTEM_PROMPT,
          temperature: style === "creative" ? 0.8 : 0,
          maxTokens: 4096,
          userId: options?.userId,
          phase: "planner",
        }
      );
      return plan;
    } catch (error) {
      if (error instanceof AIError) {
        throw error;
      }

      throw new AIError(
        `Planner generation failed: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }

  async generatePlanWithRetry(
    userPrompt: string,
    maxRetries: number = 2,
    options?: PlanGenerationOptions
  ): Promise<Plan> {
    let lastError: AIError | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.generatePlan(userPrompt, options);
      } catch (error) {
        lastError = error instanceof AIError ? error : null;

        if (lastError?.code === AIErrorCode.INVALID_INPUT) {
          throw error;
        }
        if (lastError?.code === AIErrorCode.INVALID_SCHEMA) {
          throw error;
        }
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw (
      lastError ||
      new AIError(
        "Planner generation failed after retries",
        AIErrorCode.PROVIDER_ERROR,
        500
      )
    );
  }

  async isHealthy(): Promise<boolean> {
    try {
      return await this.provider.isHealthy();
    } catch {
      return false;
    }
  }
}
