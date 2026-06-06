/**
 * FastApp – Drizzle ORM Schema
 *
 * Tables:
 *   users    – authentication identities
 *   projects – AI-generated website artefacts per user
 */

import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  index,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { GeneratedProjectMeta, DeploymentState } from "@/lib/projects/types";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Identity
    email: text("email").notNull().unique(),
    name: text("name"),
    avatarUrl: text("avatar_url"),

    // Auth – hashed password for credential-based auth; null for OAuth-only users
    passwordHash: text("password_hash"),

    // OAuth provider linkage (e.g. "github", "google")
    provider: text("provider"),
    providerAccountId: text("provider_account_id"),

    // Session / token management
    emailVerified: boolean("email_verified").default(false).notNull(),
    verificationToken: text("verification_token"),
    resetPasswordToken: text("reset_password_token"),
    resetPasswordTokenExpiresAt: timestamp("reset_password_token_expires_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_provider_idx").on(table.provider, table.providerAccountId),
  ],
);

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * DeploymentState tracks the lifecycle of a generated site.
 *
 *  idle       – just created / draft
 *  generating – AI generation in-flight
 *  generated  – HTML/CSS produced, not yet published
 *  deploying  – publish request sent to host
 *  deployed   – live on the web
 *  failed     – generation or deploy error
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Owner
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Human-readable project name (auto-generated or user-set)
    name: text("name").notNull().default("Untitled Project"),

    // The raw prompt the user submitted
    prompt: text("prompt").notNull(),

    // AI-generated artefacts
    generatedHtml: text("generated_html"),
    generatedCss: text("generated_css"),

    /**
     * Arbitrary structured metadata stored by the AI pipeline.
     * e.g. { pageTitle, colorPalette, fonts, seoMeta }
     */
    generatedMeta: jsonb("generated_meta").$type<
      GeneratedProjectMeta | null
    >(),

    // Deployment lifecycle
    deploymentState: text("deployment_state")
      .$type<DeploymentState>()
      .notNull()
      .default("idle"),

    // URL of the published site (set after successful deploy)
    deployedUrl: text("deployed_url"),

    // Error message if deploymentState === "failed"
    errorMessage: text("error_message"),

    // AI model used for generation (e.g. "gemini-2.5-pro", "gpt-4o")
    aiModel: text("ai_model"),

    // Soft-delete / archive
    isArchived: boolean("is_archived").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_deployment_state_idx").on(table.createdAt),
    index("projects_created_at_idx").on(table.createdAt),
  ],
);

// ─── Usage Logs ───────────────────────────────────────────────────────────────

export const usageLogs = pgTable(
  "usage_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "set null" }),
    model: text("model").notNull(),
    provider: text("provider").notNull(),
    promptLength: integer("prompt_length").notNull(),
    outputLength: integer("output_length").notNull(),
    status: text("status").notNull(), // "success" | "failed"
    phase: text("phase").notNull(), // "planner" | "generator" | "validator"
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("usage_logs_user_id_idx").on(table.userId),
    index("usage_logs_project_id_idx").on(table.projectId),
    index("usage_logs_created_at_idx").on(table.createdAt),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripePriceId: text("stripe_price_id"),
    stripeSubscriptionStatus: text("stripe_subscription_status"),
    plan: text("plan").notNull().default("free"), // "free" | "pro" | "enterprise"
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_stripe_customer_id_idx").on(table.stripeCustomerId),
    index("subscriptions_stripe_subscription_id_idx").on(table.stripeSubscriptionId),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  projects: many(projects),
  usageLogs: many(usageLogs),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  usageLogs: many(usageLogs),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [usageLogs.projectId],
    references: [projects.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

// ─── Type exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
