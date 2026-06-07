import { pgTable, text, timestamp, uuid, boolean, index, jsonb } from "drizzle-orm/pg-core";
import type { GeneratedProjectMeta, DeploymentState } from "@/lib/projects/types";
import { users } from "./users";

/**
 * DeploymentState lifecycle:
 *  idle → generating → generated → deploying → deployed | failed
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull().default("Untitled Project"),
    prompt: text("prompt").notNull(),
    generatedHtml: text("generated_html"),
    generatedCss: text("generated_css"),
    generatedMeta: jsonb("generated_meta").$type<GeneratedProjectMeta | null>(),
    deploymentState: text("deployment_state").$type<DeploymentState>().notNull().default("idle"),
    deployedUrl: text("deployed_url"),
    errorMessage: text("error_message"),
    aiModel: text("ai_model"),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_deployment_state_idx").on(table.createdAt),
    index("projects_created_at_idx").on(table.createdAt),
  ]
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
