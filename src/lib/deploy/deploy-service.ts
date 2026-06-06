import { ProjectService } from "../projects/project-service";
import type { DeployStep } from "./types";
import { AIError, AIErrorCode } from "../ai/types";

export class DeployService {
  private static instance: DeployService;
  private projectService = ProjectService.getInstance();

  private constructor() {}

  static getInstance(): DeployService {
    if (!DeployService.instance) {
      DeployService.instance = new DeployService();
    }
    return DeployService.instance;
  }

  /**
   * Run deployment steps progressively, updating database state and yielding progress.
   * Enforces project ownership verification via userId.
   */
  async *deployStream(projectId: string, userId: string): AsyncIterable<DeployStep & { url?: string }> {
    // 1. Fetch the project and verify ownership
    const project = await this.projectService.getProjectById(projectId, userId);
    if (!project) {
      throw new AIError("Project not found", AIErrorCode.PROVIDER_ERROR, 404);
    }

    if (!project.generatedHtml) {
      throw new AIError(
        "Cannot deploy a project without generated HTML content",
        AIErrorCode.INVALID_SCHEMA,
        400
      );
    }

    // 2. Set database status to "deploying"
    await this.projectService.updateProject(projectId, userId, {
      deploymentState: "deploying",
      errorMessage: null,
    });

    const steps: DeployStep[] = [
      { name: "routing", status: "running", message: "Provisioning edge network routing..." },
      { name: "ssl", status: "pending", message: "Generating SSL security certificates..." },
      { name: "cdn", status: "pending", message: "Caching markup at edge locations..." },
      { name: "complete", status: "pending", message: "Deploy successful!" },
    ];

    // Yield step 1: routing
    yield steps[0];
    await new Promise((r) => setTimeout(r, 1000));

    // Yield step 2: SSL
    steps[0].status = "completed";
    steps[1].status = "running";
    yield steps[1];
    await new Promise((r) => setTimeout(r, 1000));

    // Yield step 3: CDN
    steps[1].status = "completed";
    steps[2].status = "running";
    yield steps[2];
    await new Promise((r) => setTimeout(r, 1000));

    // Calculate deployment URL
    const deployedUrl = `https://fastapp.site/p/${projectId}`;

    // Update database status to "deployed"
    await this.projectService.updateProject(projectId, userId, {
      deploymentState: "deployed",
      deployedUrl,
      errorMessage: null,
    });

    // Yield step 4: complete
    steps[2].status = "completed";
    steps[3].status = "completed";
    yield {
      ...steps[3],
      url: deployedUrl,
    };
  }
}
