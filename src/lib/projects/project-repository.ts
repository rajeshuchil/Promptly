import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import type { CreateProjectInput, UpdateProjectInput, Project } from "./types";

export class ProjectRepository {
  private static instance: ProjectRepository;

  private constructor() {}

  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  /**
   * Create a new project in the database.
   */
  async create(data: CreateProjectInput): Promise<Project> {
    const [project] = await db
      .insert(schema.projects)
      .values({
        userId: data.userId,
        name: data.name ?? "Untitled Project",
        prompt: data.prompt,
        generatedHtml: data.generatedHtml ?? null,
        generatedCss: data.generatedCss ?? null,
        generatedMeta: data.generatedMeta ?? null,
        deploymentState: data.deploymentState ?? "idle",
        aiModel: data.aiModel ?? null,
        isFavorite: data.isFavorite ?? false,
      })
      .returning();

    return project as unknown as Project;
  }

  /**
   * Get a project by its unique ID.
   */
  async getById(id: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(schema.projects)
      .where(and(eq(schema.projects.id, id), eq(schema.projects.isArchived, false)));

    if (!project) return null;
    return project as unknown as Project;
  }

  /**
   * Get all active projects belonging to a specific user.
   */
  async getByUserId(userId: string): Promise<Project[]> {
    const results = await db
      .select()
      .from(schema.projects)
      .where(and(eq(schema.projects.userId, userId), eq(schema.projects.isArchived, false)))
      .orderBy(schema.projects.createdAt);

    return results as unknown as Project[];
  }

  /**
   * Update a project's fields.
   */
  async update(id: string, data: UpdateProjectInput): Promise<Project | null> {
    const [updated] = await db
      .update(schema.projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.projects.id, id))
      .returning();

    if (!updated) return null;
    return updated as unknown as Project;
  }

  /**
   * Delete a project from the database (hard delete).
   */
  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.projects)
      .where(eq(schema.projects.id, id))
      .returning({ id: schema.projects.id });

    return result.length > 0;
  }

  /**
   * Soft-delete a project by archiving it.
   */
  async archive(id: string): Promise<boolean> {
    const result = await db
      .update(schema.projects)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(schema.projects.id, id))
      .returning({ id: schema.projects.id });

    return result.length > 0;
  }
}
