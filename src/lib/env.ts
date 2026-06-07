/**
 * Environment Variable Validation
 *
 * Validates all required and optional environment variables at startup.
 * Inspired by the t3-env pattern used in reference-saasfly.
 *
 * - Required variables throw at build/startup if missing.
 * - Optional variables fall back gracefully with clear console warnings.
 * - No silent mock fallbacks in production.
 */
import { z } from "zod";

const serverEnvSchema = z.object({
  // ── Database ────────────────────────────────────────────────────────────────
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required (pooled Neon connection string)"),
  DATABASE_URL_UNPOOLED: z.string().min(1).optional(),

  // ── Auth ────────────────────────────────────────────────────────────────────
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters. Generate with: openssl rand -hex 32"),
  AUTH_URL: z.string().url().optional(),

  // ── AI Providers ────────────────────────────────────────────────────────────
  GEMINI_API_KEY: z
    .string()
    .min(1, "GEMINI_API_KEY is required. Get one at https://aistudio.google.com/app/apikey"),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),

  // ── Stripe (optional — billing features) ────────────────────────────────────
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // ── Node environment ────────────────────────────────────────────────────────
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().optional().default("FastApp"),
  NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: z.string().optional(),
});

function validateServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, errs]) => `  ✗ ${key}: ${errs?.join(", ")}`)
      .join("\n");

    throw new Error(
      `\n\n❌ FastApp: Invalid environment variables detected.\n` +
      `Please check your .env.local file:\n\n${messages}\n\n` +
      `See .env.example for a complete list of required variables.\n`
    );
  }

  // Warn about missing optional AI providers in development
  if (parsed.data.NODE_ENV === "development") {
    const optionalProviders = [
      ["OPENAI_API_KEY", "OpenAI"],
      ["ANTHROPIC_API_KEY", "Anthropic"],
      ["OPENROUTER_API_KEY", "OpenRouter"],
    ] as const;

    for (const [key, name] of optionalProviders) {
      if (!parsed.data[key]) {
        console.warn(`[FastApp] Optional: ${key} not set — ${name} provider disabled.`);
      }
    }

    if (!parsed.data.STRIPE_SECRET_KEY) {
      console.warn(`[FastApp] Optional: STRIPE_SECRET_KEY not set — billing features will use mock mode.`);
    }
  }

  return parsed.data;
}

function validateClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  });

  if (!parsed.success) {
    console.error("[FastApp] Client env validation failed:", parsed.error.flatten());
  }

  return parsed.success ? parsed.data : clientEnvSchema.parse({});
}

/**
 * Validated server-side environment variables.
 * Only import this in server components, API routes, and service modules.
 * Never import in client components — it would expose secrets.
 */
export const env = validateServerEnv();

/**
 * Validated client-safe environment variables.
 * Safe to import anywhere including client components.
 */
export const clientEnv = validateClientEnv();
