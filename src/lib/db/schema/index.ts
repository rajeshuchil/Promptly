/**
 * FastApp – Drizzle ORM Schema Index
 *
 * Re-exports all domain schemas and their Drizzle relations.
 * Consumers should import from here OR directly from the domain file.
 */

export { users, type User, type NewUser } from "./users";
export { projects, type Project, type NewProject } from "./projects";
export { usageLogs, type UsageLog, type NewUsageLog } from "./usage";
export { subscriptions, type Subscription, type NewSubscription } from "./billing";

// ─── Relations ────────────────────────────────────────────────────────────────
import { relations } from "drizzle-orm";
import { users } from "./users";
import { projects } from "./projects";
import { usageLogs } from "./usage";
import { subscriptions } from "./billing";

export const usersRelations = relations(users, ({ one, many }) => ({
  projects: many(projects),
  usageLogs: many(usageLogs),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  usageLogs: many(usageLogs),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, { fields: [usageLogs.userId], references: [users.id] }),
  project: one(projects, { fields: [usageLogs.projectId], references: [projects.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));
