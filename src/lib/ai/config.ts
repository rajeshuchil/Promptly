export interface AIConfiguration {
  defaultPlannerModel: string;
  defaultGeneratorModel: string;
  enabledProviders: {
    gemini: boolean;
    openai: boolean;
    anthropic: boolean;
    openrouter: boolean;
    groq: boolean;
  };
}

export class AIConfigService {
  private static instance: AIConfigService;
  private config: AIConfiguration;

  private constructor() {
    this.config = {
      defaultPlannerModel: process.env.AI_DEFAULT_PLANNER_MODEL || "llama-3.3-70b-versatile",
      defaultGeneratorModel: process.env.AI_DEFAULT_GENERATOR_MODEL || "llama-3.3-70b-versatile",
      enabledProviders: {
        gemini: !!process.env.GEMINI_API_KEY || process.env.AI_ENABLE_GEMINI === "true",
        openai: !!process.env.OPENAI_API_KEY || process.env.AI_ENABLE_OPENAI === "true",
        anthropic: !!process.env.ANTHROPIC_API_KEY || process.env.AI_ENABLE_ANTHROPIC === "true",
        openrouter: !!process.env.OPENROUTER_API_KEY || process.env.AI_ENABLE_OPENROUTER === "true",
        groq: process.env.AI_ENABLE_GROQ !== "false",
      },
    };
  }

  static getInstance(): AIConfigService {
    if (!AIConfigService.instance) {
      AIConfigService.instance = new AIConfigService();
    }
    return AIConfigService.instance;
  }

  getConfig(): AIConfiguration {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AIConfiguration>): void {
    this.config = {
      ...this.config,
      ...updates,
      enabledProviders: {
        ...this.config.enabledProviders,
        ...updates.enabledProviders,
      },
    };
  }
}
