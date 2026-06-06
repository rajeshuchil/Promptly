import { ProjectRepository } from "./project-repository";
import { CreateProjectSchema, UpdateProjectSchema } from "./schemas";
import type { CreateProjectInput, UpdateProjectInput, Project } from "./types";
import { AIError, AIErrorCode } from "@/lib/ai/types";
import { db, schema } from "@/lib/db";

export class ProjectService {
  private static instance: ProjectService;
  private repository = ProjectRepository.getInstance();

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  /**
   * Helper to retrieve the first user in the database or create a default user.
   * Deprecated: Use actual session authentication instead.
   */
  async getOrCreateDefaultUser(): Promise<string> {
    const [firstUser] = await db.select().from(schema.users).limit(1);
    if (firstUser) {
      return firstUser.id;
    }

    const [newUser] = await db
      .insert(schema.users)
      .values({
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
      })
      .returning();

    return newUser.id;
  }

  /**
   * Create a new project.
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    const parsed = CreateProjectSchema.safeParse(input);
    if (!parsed.success) {
      throw new AIError(
        `Invalid project creation input: ${parsed.error.message}`,
        AIErrorCode.INVALID_INPUT,
        400
      );
    }

    try {
      return await this.repository.create(input);
    } catch (error) {
      throw new AIError(
        `Failed to create project: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PERSISTENCE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * Retrieve a project by ID and verify user ownership.
   */
  async getProjectById(id: string, userId: string): Promise<Project> {
    if (!id) {
      throw new AIError("Project ID is required", AIErrorCode.INVALID_INPUT, 400);
    }
    if (!userId) {
      throw new AIError("User ID is required for authorization", AIErrorCode.INVALID_INPUT, 400);
    }

    try {
      const project = await this.repository.getById(id);
      if (!project) {
        throw new AIError("Project not found", AIErrorCode.NOT_FOUND, 404);
      }
      if (project.userId !== userId) {
        throw new AIError("Unauthorized: You do not own this project", AIErrorCode.PROVIDER_ERROR, 403);
      }
      return project;
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Failed to retrieve project: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PERSISTENCE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * Retrieve all projects for a specific user.
   */
  async getProjectsByUser(userId: string): Promise<Project[]> {
    if (!userId) {
      throw new AIError("User ID is required", AIErrorCode.INVALID_INPUT, 400);
    }

    try {
      return await this.repository.getByUserId(userId);
    } catch (error) {
      throw new AIError(
        `Failed to retrieve user projects: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PERSISTENCE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * Update an existing project and verify user ownership.
   */
  async updateProject(id: string, userId: string, input: UpdateProjectInput): Promise<Project> {
    if (!id) {
      throw new AIError("Project ID is required for update", AIErrorCode.INVALID_INPUT, 400);
    }
    if (!userId) {
      throw new AIError("User ID is required for update authorization", AIErrorCode.INVALID_INPUT, 400);
    }

    const parsed = UpdateProjectSchema.safeParse(input);
    if (!parsed.success) {
      throw new AIError(
        `Invalid project update input: ${parsed.error.message}`,
        AIErrorCode.INVALID_INPUT,
        400
      );
    }

    // Load project first to verify ownership
    await this.getProjectById(id, userId);

    try {
      const updated = await this.repository.update(id, input);
      if (!updated) {
        throw new AIError("Project not found or update failed", AIErrorCode.NOT_FOUND, 404);
      }
      return updated;
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Failed to update project: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PERSISTENCE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * Hard-delete a project by ID and verify user ownership.
   */
  async deleteProject(id: string, userId: string): Promise<boolean> {
    if (!id) {
      throw new AIError("Project ID is required for deletion", AIErrorCode.INVALID_INPUT, 400);
    }
    if (!userId) {
      throw new AIError("User ID is required for deletion authorization", AIErrorCode.INVALID_INPUT, 400);
    }

    // Verify ownership
    await this.getProjectById(id, userId);

    try {
      const deleted = await this.repository.delete(id);
      if (!deleted) {
        throw new AIError("Project not found or already deleted", AIErrorCode.NOT_FOUND, 404);
      }
      return true;
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Failed to delete project: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PERSISTENCE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * Soft-delete (archive) a project by ID and verify user ownership.
   */
  async archiveProject(id: string, userId: string): Promise<boolean> {
    if (!id) {
      throw new AIError("Project ID is required for archiving", AIErrorCode.INVALID_INPUT, 400);
    }
    if (!userId) {
      throw new AIError("User ID is required for archive authorization", AIErrorCode.INVALID_INPUT, 400);
    }

    // Verify ownership
    await this.getProjectById(id, userId);

    try {
      const archived = await this.repository.archive(id);
      if (!archived) {
        throw new AIError("Project not found or already archived", AIErrorCode.NOT_FOUND, 404);
      }
      return true;
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Failed to archive project: ${error instanceof Error ? error.message : String(error)}`,
        AIErrorCode.PERSISTENCE_ERROR,
        500,
        error
      );
    }
  }
}
