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
    index("projects_deployment_state_idx").on(table.deploymentState),
    index("projects_created_at_idx").on(table.createdAt),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

// ─── Type exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
