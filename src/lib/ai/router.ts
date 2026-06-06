import { AIConfigService } from "./config";
import { MODEL_CATALOG } from "./models/catalog";
import { SubscriptionService } from "@/lib/billing/subscription-service";
import type { AIModelDetails } from "./models/types";

export class ModelRouter {
  private static instance: ModelRouter;
  private configService = AIConfigService.getInstance();

  private constructor() {}

  static getInstance(): ModelRouter {
    if (!ModelRouter.instance) {
      ModelRouter.instance = new ModelRouter();
    }
    return ModelRouter.instance;
  }

  async route(
    userId: string | undefined,
    phase: "planner" | "generator"
  ): Promise<AIModelDetails> {
    const config = this.configService.getConfig();

    // 1. Determine base model based on phase from admin configuration
    let modelId =
      phase === "planner"
        ? config.defaultPlannerModel
        : config.defaultGeneratorModel;

    // 2. Resolve user's subscription capabilities & entitlements
    if (userId) {
      try {
        const subscriptionService = SubscriptionService.getInstance();
        const sub = await subscriptionService.getSubscription(userId);
        const plan = sub.plan;

        // Free plan restriction: Free users are gated strictly to Gemini 2.5 Flash
        if (plan === "free") {
          modelId = "gemini-2.5-flash";
        } else if (plan === "pro") {
          // Pro plan capabilities: can use Gemini Pro, GPT-4o, Claude Sonnet, OpenRouter Llama
          const catalogModel = MODEL_CATALOG[modelId];
          const isAllowedModel =
            catalogModel &&
            (catalogModel.id === "gemini-2.5-flash" ||
              catalogModel.id === "gemini-2.5-pro" ||
              catalogModel.id === "gpt-4o" ||
              catalogModel.id === "claude-3-5-sonnet-20241022" ||
              catalogModel.id === "meta-llama/llama-3.1-70b-instruct");

          if (!isAllowedModel) {
            // Default Pro model fallbacks
            modelId = phase === "planner" ? "gemini-2.5-flash" : "claude-3-5-sonnet";
          }
        }
        // Enterprise plan: unrestricted access to all models in catalog
      } catch (err) {
        console.error("Failed to check subscription during model routing, falling back to default:", err);
      }
    } else {
      // No user context: default to Gemini 2.5 Flash for safety
      modelId = "gemini-2.5-flash";
    }

    const modelDetails = MODEL_CATALOG[modelId];
    if (!modelDetails) {
      // Fallback model
      return MODEL_CATALOG["gemini-2.5-flash"];
    }

    // 3. Verify if provider is enabled in admin config
    const providerEnabled = config.enabledProviders[modelDetails.provider];
    if (!providerEnabled) {
      // Fallback to gemini-2.5-flash (since it must be always supported/running in dev mode)
      return MODEL_CATALOG["gemini-2.5-flash"];
    }

    return modelDetails;
  }
}
