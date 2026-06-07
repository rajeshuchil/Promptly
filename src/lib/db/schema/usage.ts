import { pgTable, text, timestamp, uuid, integer, doublePrecision, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { projects } from "./projects";

export const usageLogs = pgTable(
  "usage_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    model: text("model").notNull(),
    provider: text("provider").notNull(),
    promptLength: integer("prompt_length").notNull(),
    outputLength: integer("output_length").notNull(),
    status: text("status").notNull(),         // "success" | "failed"
    phase: text("phase").notNull(),            // "planner" | "generator" | "validator"
    errorMessage: text("error_message"),
    promptTokens: integer("prompt_tokens"),
    completionTokens: integer("completion_tokens"),
    totalTokens: integer("total_tokens"),
    estimatedCost: doublePrecision("estimated_cost"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("usage_logs_user_id_idx").on(table.userId),
    index("usage_logs_project_id_idx").on(table.projectId),
    index("usage_logs_created_at_idx").on(table.createdAt),
  ]
);

export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;
