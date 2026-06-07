import { pgTable, text, timestamp, uuid, boolean, index, jsonb, integer } from "drizzle-orm/pg-core";
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
    deploymentMetadata: jsonb("deployment_metadata"),
    deploymentTimestamp: timestamp("deployment_timestamp", { withTimezone: true }),
    aiModel: text("ai_model"),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_deployment_state_idx").on(table.deploymentState),
    index("projects_created_at_idx").on(table.createdAt),
  ]
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const projectRevisions = pgTable(
  "project_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    revisionNumber: integer("revision_number").notNull(),
    prompt: text("prompt").notNull(),
    plan: jsonb("plan").notNull(),
    html: text("html").notNull(),
    css: text("css"),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("revisions_project_id_idx").on(table.projectId),
    index("revisions_created_at_idx").on(table.createdAt),
  ]
);

export type ProjectRevision = typeof projectRevisions.$inferSelect;
export type NewProjectRevision = typeof projectRevisions.$inferInsert;

export const projectTimelineEvents = pgTable(
  "project_timeline_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(), // 'created' | 'generated' | 'edited' | 'published' | 'exported'
    eventMetadata: jsonb("event_metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("timeline_project_id_idx").on(table.projectId),
    index("timeline_created_at_idx").on(table.createdAt),
  ]
);

export type ProjectTimelineEvent = typeof projectTimelineEvents.$inferSelect;
export type NewProjectTimelineEvent = typeof projectTimelineEvents.$inferInsert;
