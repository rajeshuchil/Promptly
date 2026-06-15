import { ProjectService } from "../projects/project-service";
import { DeploymentProvider } from "./deployment-provider";
import { MockDeploymentProvider } from "./providers/mock-provider";
import { VercelDeploymentProvider } from "./providers/vercel-provider";
import {
  DeploymentRecord,
  DeploymentStep,
  DeploymentStatus,
  DeploymentResult,
} from "./deployment-types";
import { AIError, AIErrorCode } from "../ai/types";
import { isValidTransition } from "./deployment-status";

export class DeploymentService {
  private static instance: DeploymentService;
  private projectService = ProjectService.getInstance();
  private providers: Map<string, DeploymentProvider> = new Map();

  private constructor() {
    // Register deployment providers
    this.registerProvider(new MockDeploymentProvider());
    this.registerProvider(new VercelDeploymentProvider());
  }

  static getInstance(): DeploymentService {
    if (!DeploymentService.instance) {
      DeploymentService.instance = new DeploymentService();
    }
    return DeploymentService.instance;
  }

  /**
   * Register a new deployment provider.
   */
  registerProvider(provider: DeploymentProvider): void {
    this.providers.set(provider.getName(), provider);
  }

  /**
   * Get deployment provider by name.
   */
  getProvider(name: string): DeploymentProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new AIError(
        `Deployment provider '${name}' is not registered`,
        AIErrorCode.PROVIDER_ERROR,
        400
      );
    }
    return provider;
  }

  /**
   * Orchestrate project deployment and stream progress via async generator.
   */
  async *deployStream(
    projectId: string,
    userId: string,
    providerName = "mock",
    options?: Record<string, any>
  ): AsyncIterable<DeploymentStep & { url?: string }> {
    // 1. Fetch project and verify ownership
    const project = await this.projectService.getProjectById(projectId, userId);
    if (!project) {
      throw new AIError("Project not found", AIErrorCode.PROVIDER_ERROR, 404);
    }

    const plan = project.generatedMeta?.plan;
    const isV2 = plan && Array.isArray((plan as any).sections) && (plan as any).sections.length > 0 && typeof (plan as any).sections[0] === 'object';

    let htmlContent = options?.html || project.generatedHtml || "";
    if (options?.html && options.html !== project.generatedHtml) {
      try {
        await this.projectService.updateProject(projectId, userId, {
          generatedHtml: options.html,
        });
      } catch (dbErr) {
        console.error("Failed to update project generatedHtml on deploy:", dbErr);
      }
    }

    if (!htmlContent && isV2 && plan) {
      const { compilePageSpecToHtml } = await import("@/lib/builder/compiler");
      htmlContent = await compilePageSpecToHtml(plan as any);
    }

    if (!htmlContent) {
      throw new AIError(
        "Cannot deploy a project without generated HTML content",
        AIErrorCode.INVALID_SCHEMA,
        400
      );
    }

    // 2. Select provider
    const provider = this.getProvider(providerName);

    // 3. Initialize deployment record
    const runId = `run_${Math.random().toString(36).substr(2, 9)}`;
    const timestampStr = new Date().toISOString();

    const record: DeploymentRecord = {
      id: runId,
      projectId,
      providerName,
      status: "queued",
      timestamp: timestampStr,
      steps: [],
    };

    // Prepare metadata block
    const meta = (project.deploymentMetadata as {
      current?: DeploymentRecord | null;
      history?: DeploymentRecord[];
    }) || { current: null, history: [] };

    const history = Array.isArray(meta.history) ? [...meta.history] : [];

    // Transition DB status to 'queued'
    await this.projectService.updateProject(projectId, userId, {
      deploymentState: "queued",
      errorMessage: null,
      deploymentTimestamp: new Date(timestampStr),
      deploymentMetadata: {
        current: record,
        history,
      },
    });

    // 4. Run streaming deploy from provider
    const stream = provider.deployStream(projectId, htmlContent, options);

    for await (const chunk of stream) {
      // Keep record steps synchronized
      const stepIndex = record.steps!.findIndex((s) => s.name === chunk.name);
      const stepItem: DeploymentStep = {
        name: chunk.name,
        status: chunk.status,
        message: chunk.message,
        url: chunk.url,
      };

      if (stepIndex >= 0) {
        record.steps![stepIndex] = stepItem;
      } else {
        record.steps!.push(stepItem);
      }

      // Map step name to DeploymentStatus for state transitions
      let nextStatus: DeploymentStatus = "deploying";
      if (chunk.name === "queued") nextStatus = "queued";
      if (chunk.name === "building") nextStatus = "building";
      if (chunk.name === "deploying") nextStatus = "deploying";

      if (chunk.result) {
        if (chunk.result.success) {
          nextStatus = "deployed";
          record.status = "deployed";
          record.url = chunk.result.url;
          record.metadata = chunk.result.metadata;

          // Record published timeline event
          try {
            const { HistoryService } = await import("../iterations/history-service");
            await HistoryService.getInstance().recordTimelineEvent({
              projectId,
              userId,
              eventType: "published",
              eventMetadata: {
                provider: providerName,
                url: chunk.result.url,
              },
            });
          } catch (timelineErr) {
            console.error("Failed to record published timeline event:", timelineErr);
          }
        } else {
          nextStatus = "failed";
          record.status = "failed";
          record.errorMessage = chunk.result.error;
        }
      } else {
        record.status = nextStatus;
      }

      // Update state in project db
      const updatePayload: any = {
        deploymentState: nextStatus,
        deploymentMetadata: {
          current: record,
          history,
        },
      };

      if (chunk.result) {
        if (chunk.result.success) {
          updatePayload.deployedUrl = chunk.result.url;
          // Archive successful run to history
          updatePayload.deploymentMetadata.history.unshift(record);
        } else {
          updatePayload.errorMessage = chunk.result.error ?? "Provider deployment failed";
          updatePayload.deploymentMetadata.history.unshift(record);
        }
      }

      await this.projectService.updateProject(projectId, userId, updatePayload);

      // Yield back to SSE route
      yield {
        name: chunk.name,
        status: chunk.status,
        message: chunk.message,
        url: chunk.url,
      };
    }
  }
}
