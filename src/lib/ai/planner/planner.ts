import { getProvider } from "../providers/factory";
import { PlanSchema, type Plan } from "./schemas";
import {
  PLANNER_SYSTEM_PROMPT,
  buildPlannerUserPrompt,
  buildCreativePlannerPrompt,
  buildAccessiblePlannerPrompt,
} from "./prompts";
import { AIError, AIErrorCode } from "../types";
import { getTemplateById } from "@/lib/templates/templates";
import { getBlueprintForPageType } from "@/lib/templates/blueprint";
import { compileDesignSystemKnowledge } from "@/lib/design-system";

export type PlannerStyle = "default" | "creative" | "accessible";

export interface PlanGenerationOptions {
  style?: PlannerStyle;
  userId?: string;
  projectId?: string;
  templateId?: string;
  blueprintId?: string;
  onFallback?: (message: string) => void;
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
    let userMessage = promptBuilder(userPrompt);

    // ─── Resolve Template and Blueprint Context ───
    let templateContext = "";
    let blueprintContext = "";

    if (options?.templateId) {
      const template = getTemplateById(options.templateId);
      if (template) {
        templateContext = `
[TEMPLATE CONSTRAINTS]
The user selected the template "${template.title}" (Page Type: "${template.pageType}").
You MUST design the page structure matching these exact template specs, adapting copy/content to the user's prompt:
- Theme: ${template.theme}
- Layout: ${template.layout}
- Design Tokens: ${JSON.stringify(template.designTokens)}
- Style Keywords: ${JSON.stringify(template.styleKeywords)}
- Sections Structure (maintain this exact sequence): ${JSON.stringify(template.sections)}
- Components to include: ${JSON.stringify(template.components)}
`;
      }
    }

    // Resolve blueprint
    let resolvedBlueprint = null;
    if (options?.templateId) {
      const template = getTemplateById(options.templateId);
      if (template) {
        resolvedBlueprint = getBlueprintForPageType(template.pageType);
      }
    } else if (options?.blueprintId) {
      const bpId = options.blueprintId.replace("blueprint-", "");
      resolvedBlueprint = getBlueprintForPageType(bpId);
    } else {
      // Auto-detect blueprint by page type keywords
      const lowerPrompt = userPrompt.toLowerCase();
      if (lowerPrompt.includes("admin panel") || lowerPrompt.includes("admin")) {
        resolvedBlueprint = getBlueprintForPageType("admin-panel");
      } else if (lowerPrompt.includes("crm") || lowerPrompt.includes("relationship") || lowerPrompt.includes("customer relation")) {
        resolvedBlueprint = getBlueprintForPageType("crm");
      } else if (lowerPrompt.includes("analytics") || lowerPrompt.includes("charts") || lowerPrompt.includes("bi dashboard") || lowerPrompt.includes("metrics console")) {
        resolvedBlueprint = getBlueprintForPageType("analytics");
      } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("portal")) {
        resolvedBlueprint = getBlueprintForPageType("dashboard");
      } else if (lowerPrompt.includes("portfolio") || lowerPrompt.includes("resume") || lowerPrompt.includes("cv")) {
        resolvedBlueprint = getBlueprintForPageType("portfolio");
      } else if (lowerPrompt.includes("documentation") || lowerPrompt.includes("docs") || lowerPrompt.includes("manual")) {
        resolvedBlueprint = getBlueprintForPageType("documentation");
      } else {
        resolvedBlueprint = getBlueprintForPageType("landing");
      }
    }

    if (resolvedBlueprint) {
      blueprintContext = `
[BLUEPRINT RULES]
The page belongs to category "${resolvedBlueprint.name}".
Apply these rules to reduce layout ambiguity:
- Default Layout: ${resolvedBlueprint.defaultLayout}
- Required Sections: ${JSON.stringify(resolvedBlueprint.requiredSections)}
- Suggested Components: ${JSON.stringify(resolvedBlueprint.suggestedComponents)}
`;
    }

    if (blueprintContext || templateContext) {
      userMessage += `\n\nAdditional layout & structure guidelines:${blueprintContext}${templateContext}`;
    }

    // Inject compiled design system catalog
    const designSystemKnowledge = compileDesignSystemKnowledge();
    userMessage += `\n\n[DESIGN CATALOG CONTEXT]\nUse the following Design System elements, color presets, spacing and typography tokens to make your choices:\n${designSystemKnowledge}`;

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
          onFallback: options?.onFallback,
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
