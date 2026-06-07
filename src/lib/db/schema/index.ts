/**
 * FastApp – Drizzle ORM Schema Index
 *
 * Re-exports all domain schemas and their Drizzle relations.
 * Consumers should import from here OR directly from the domain file.
 */

export { users, type User, type NewUser } from "./users";
export { projects, type Project, type NewProject, projectRevisions, type ProjectRevision, type NewProjectRevision, projectTimelineEvents, type ProjectTimelineEvent, type NewProjectTimelineEvent } from "./projects";
export { usageLogs, type UsageLog, type NewUsageLog } from "./usage";
export { subscriptions, type Subscription, type NewSubscription } from "./billing";

// ─── Relations ────────────────────────────────────────────────────────────────
import { relations } from "drizzle-orm";
import { users } from "./users";
import { projects, projectRevisions, projectTimelineEvents } from "./projects";
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
  revisions: many(projectRevisions),
  timelineEvents: many(projectTimelineEvents),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, { fields: [usageLogs.userId], references: [users.id] }),
  project: one(projects, { fields: [usageLogs.projectId], references: [projects.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const projectRevisionsRelations = relations(projectRevisions, ({ one }) => ({
  project: one(projects, { fields: [projectRevisions.projectId], references: [projects.id] }),
  user: one(users, { fields: [projectRevisions.userId], references: [users.id] }),
}));

export const projectTimelineEventsRelations = relations(projectTimelineEvents, ({ one }) => ({
  project: one(projects, { fields: [projectTimelineEvents.projectId], references: [projects.id] }),
  user: one(users, { fields: [projectTimelineEvents.userId], references: [users.id] }),
}));
