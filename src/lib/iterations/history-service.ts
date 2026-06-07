import { db } from "@/lib/db";
import { projectRevisions, projectTimelineEvents, projects } from "@/lib/db/schema/projects";
import { eq, desc, and } from "drizzle-orm";
import type { Plan } from "../ai/planner/schemas";
import type { TimelineEventType } from "./edit-types";

export class HistoryService {
  private static instance: HistoryService;

  private constructor() {}

  public static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  /**
   * Get the next revision number for a project.
   */
  public async getNextRevisionNumber(projectId: string): Promise<number> {
    const latest = await db
      .select({ revisionNumber: projectRevisions.revisionNumber })
      .from(projectRevisions)
      .where(eq(projectRevisions.projectId, projectId))
      .orderBy(desc(projectRevisions.revisionNumber))
      .limit(1);

    if (latest.length === 0) {
      return 1; // v1
    }
    return latest[0].revisionNumber + 1;
  }

  /**
   * Record a new project revision.
   */
  public async recordRevision(options: {
    projectId: string;
    userId: string;
    prompt: string;
    plan: Plan;
    html: string;
    meta?: any;
  }) {
    const revisionNumber = await this.getNextRevisionNumber(options.projectId);

    const [revision] = await db
      .insert(projectRevisions)
      .values({
        projectId: options.projectId,
        userId: options.userId,
        revisionNumber,
        prompt: options.prompt,
        plan: options.plan,
        html: options.html,
        meta: options.meta || {},
      })
      .returning();

    // Add corresponding timeline event
    await this.recordTimelineEvent({
      projectId: options.projectId,
      userId: options.userId,
      eventType: "edited",
      eventMetadata: {
        revisionId: revision.id,
        revisionNumber,
        prompt: options.prompt,
      },
    });

    return revision;
  }

  /**
   * Get revision history for a project.
   */
  public async getRevisions(projectId: string) {
    return db
      .select()
      .from(projectRevisions)
      .where(eq(projectRevisions.projectId, projectId))
      .orderBy(desc(projectRevisions.revisionNumber));
  }

  /**
   * Get a specific revision by ID.
   */
  public async getRevisionById(revisionId: string) {
    const [revision] = await db
      .select()
      .from(projectRevisions)
      .where(eq(projectRevisions.id, revisionId))
      .limit(1);
    return revision || null;
  }

  /**
   * Record a project lifecycle event.
   */
  public async recordTimelineEvent(options: {
    projectId: string;
    userId: string;
    eventType: TimelineEventType;
    eventMetadata?: any;
  }) {
    const [event] = await db
      .insert(projectTimelineEvents)
      .values({
        projectId: options.projectId,
        userId: options.userId,
        eventType: options.eventType,
        eventMetadata: options.eventMetadata || {},
      })
      .returning();

    return event;
  }

  /**
   * Get timeline history for a project.
   */
  public async getTimelineEvents(projectId: string) {
    return db
      .select()
      .from(projectTimelineEvents)
      .where(eq(projectTimelineEvents.projectId, projectId))
      .orderBy(desc(projectTimelineEvents.createdAt));
  }
}
