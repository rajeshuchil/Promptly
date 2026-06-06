import { ProjectService } from "../projects/project-service";
import { ZipBuilder } from "./zip-builder";
import { buildReadmeTemplate } from "./templates";
import type { ExportFormat, ExportResult } from "./types";
import { AIError, AIErrorCode } from "../ai/types";

export class ExportService {
  private static instance: ExportService;
  private projectService = ProjectService.getInstance();

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * Orchestrates the export process for a given project ID and target format,
   * verifying user ownership.
   */
  async exportProject(projectId: string, userId: string, format: ExportFormat): Promise<ExportResult> {
    // 1. Fetch the project and verify ownership
    const project = await this.projectService.getProjectById(projectId, userId);
    if (!project) {
      throw new AIError(
        "Project not found",
        AIErrorCode.PROVIDER_ERROR,
        404
      );
    }

    if (!project.generatedHtml) {
      throw new AIError(
        "Project contains no generated HTML content to export",
        AIErrorCode.INVALID_SCHEMA,
        400
      );
    }

    // Sanitize project name for filename
    const safeName = project.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    switch (format) {
      case "html": {
        return {
          filename: `${safeName || "project"}.html`,
          contentType: "text/html; charset=utf-8",
          data: project.generatedHtml,
        };
      }

      case "zip": {
        const builder = new ZipBuilder();
        builder.addFile("index.html", project.generatedHtml);
        builder.addFolder("assets");
        
        const readmeContent = buildReadmeTemplate(project.name, project.prompt);
        builder.addFile("README.md", readmeContent);

        const buffer = await builder.generateBuffer();

        return {
          filename: `${safeName || "project"}.zip`,
          contentType: "application/zip",
          data: buffer,
        };
      }

      case "react":
      case "nextjs": {
        throw new AIError(
          `Export format '${format}' is planned but not implemented in this version of FastApp`,
          AIErrorCode.PROVIDER_ERROR,
          501
        );
      }

      default: {
        throw new AIError(
          `Unsupported export format: ${format}`,
          AIErrorCode.INVALID_INPUT,
          400
        );
      }
    }
  }
}
