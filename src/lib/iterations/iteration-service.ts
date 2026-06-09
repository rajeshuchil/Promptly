import { getProvider } from "../ai/providers/factory";
import { PlanSchema, type Plan } from "../ai/planner/schemas";
import { HtmlValidator } from "../ai/validator/validator";
import { db } from "@/lib/db";
import { projects, projectRevisions } from "@/lib/db/schema/projects";
import { eq } from "drizzle-orm";
import {
  PLAN_EDITOR_SYSTEM_PROMPT,
  buildPlanEditorUserPrompt,
  HTML_EDITOR_SYSTEM_PROMPT,
  buildHtmlEditorUserPrompt,
} from "./edit-prompts";
import { HistoryService } from "./history-service";
import type { IterationInput } from "./edit-types";
import { AIError, AIErrorCode } from "../ai/types";
import { compileDesignSystemKnowledge } from "../design-system";

export function diffPlans(originalPlan: Plan, updatedPlan: Plan) {
  const sectionsOriginal = (originalPlan.sections || []) as any[];
  const sectionsUpdated = (updatedPlan.sections || []) as any[];

  // Helper to get string key for a section
  const getSecKey = (s: any) => typeof s === 'object' && s !== null ? s.type : String(s);

  const origKeys = sectionsOriginal.map(getSecKey);
  const updKeys = sectionsUpdated.map(getSecKey);

  const addedSections = updKeys.filter((k) => !origKeys.includes(k));
  const removedSections = origKeys.filter((k) => !updKeys.includes(k));

  // Check order
  let reorderedSections = false;
  const commonOriginal = origKeys.filter((k) => updKeys.includes(k));
  const commonUpdated = updKeys.filter((k) => origKeys.includes(k));
  if (JSON.stringify(commonOriginal) !== JSON.stringify(commonUpdated)) {
    reorderedSections = true;
  }

  const o = originalPlan as any;
  const u = updatedPlan as any;

  const pageTypeChanged = originalPlan.pageType !== updatedPlan.pageType;
  const themeChanged = originalPlan.theme !== updatedPlan.theme;
  const layoutChanged = originalPlan.layout !== updatedPlan.layout;

  const designTokensOriginal = o.designTokens || {};
  const designTokensUpdated = u.designTokens || {};
  const tokenChanges: Array<{ key: string; from?: any; to?: any }> = [];

  for (const key of Object.keys({ ...designTokensOriginal, ...designTokensUpdated })) {
    const fromVal = (designTokensOriginal as any)[key];
    const toVal = (designTokensUpdated as any)[key];
    if (fromVal !== toVal) {
      tokenChanges.push({ key, from: fromVal, to: toVal });
    }
  }

  return {
    pageType: pageTypeChanged ? { from: originalPlan.pageType, to: updatedPlan.pageType } : undefined,
    theme: themeChanged ? { from: originalPlan.theme, to: updatedPlan.theme } : undefined,
    layout: layoutChanged ? { from: originalPlan.layout, to: updatedPlan.layout } : undefined,
    sections: {
      added: addedSections,
      removed: removedSections,
      reordered: reorderedSections,
    },
    designTokens: tokenChanges,
  };
}

export class IterationService {
  private static instance: IterationService;
  private provider = getProvider();
  private historyService = HistoryService.getInstance();
  private validator = HtmlValidator.getInstance();

  private constructor() {}

  public static getInstance(): IterationService {
    if (!IterationService.instance) {
      IterationService.instance = new IterationService();
    }
    return IterationService.instance;
  }

  /**
   * Ensures the project has a baseline revision recorded (v1) if none exists.
   */
  public async ensureBaselineRevision(projectId: string, userId: string, project: any) {
    const revisions = await this.historyService.getRevisions(projectId);
    if (revisions.length === 0) {
      // Record baseline revision 1
      await db.insert(projectRevisions).values({
        projectId,
        userId,
        revisionNumber: 1,
        prompt: project.prompt || "Initial creation",
        plan: project.generatedMeta?.plan || {},
        html: project.generatedHtml || "",
        css: project.generatedCss || "",
        meta: project.generatedMeta || {},
      });

      // Add timeline event for initial creation
      await this.historyService.recordTimelineEvent({
        projectId,
        userId,
        eventType: "created",
        eventMetadata: {
          revisionNumber: 1,
          prompt: project.prompt,
        },
      });
    }
  }

  public async editPlan(originalPlan: Plan, editPrompt: string, userId?: string, onFallback?: (message: string) => void): Promise<Plan> {
    const userMessage = buildPlanEditorUserPrompt(originalPlan, editPrompt);

    try {
      const updatedPlan = await this.provider.generateStructured(
        userMessage,
        PlanSchema,
        {
          systemPrompt: PLAN_EDITOR_SYSTEM_PROMPT,
          userId,
          phase: "planner",
          onFallback,
        }
      );
      return updatedPlan;
    } catch (error: any) {
      throw new AIError(
        `Failed to edit design plan: ${error.message || String(error)}`,
        AIErrorCode.PROVIDER_ERROR,
        500,
        error
      );
    }
  }

  /**
   * Iterates a website, updating the plan first, then streaming the HTML generation,
   * running the quality evaluator, saving the revision, and updating the database.
   */
  public async *iterate(input: IterationInput): AsyncIterable<{
    event: "planning" | "generating" | "chunk" | "validating" | "saving" | "complete" | "error" | "warning";
    message?: string;
    chunk?: string;
    html?: string;
    plan?: Plan;
    projectId?: string;
  }> {
    const { projectId, prompt, userId } = input;

    try {
      // 1. Fetch current project state
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!project) {
        yield { event: "error", message: `Project not found with ID ${projectId}` };
        return;
      }

      // Ensure baseline revision (v1) is set up
      await this.ensureBaselineRevision(projectId, userId, project);

      // Get current plan & HTML
      const originalPlan = (project.generatedMeta?.plan || {}) as Plan;

      // 2. Planning Phase (AI Edit Plan)
      yield { event: "planning", message: "Refining planner strategy based on revision request..." };
      
      const eventQueue: { event: "warning"; message: string }[] = [];
      const onFallback = (msg: string) => {
        eventQueue.push({ event: "warning", message: msg });
      };

      const updatedPlan = await this.editPlan(originalPlan, prompt, userId, onFallback);
      
      while (eventQueue.length > 0) {
        yield eventQueue.shift()!;
      }

      const planDiff = diffPlans(originalPlan, updatedPlan);

      yield { event: "planning", message: "Plan strategy modified successfully.", plan: updatedPlan };

      // 3. Streaming Code Mapping Phase (V2: Instant mapping)
      yield { event: "generating", message: "Applying specification modifications..." };

      const specHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FastApp V2 Page Spec</title>
</head>
<body>
  <div id="fastapp-spec-renderer"></div>
</body>
</html>`;

      yield { event: "chunk", chunk: specHtml };

      // 4. Quality Safeguard / Validation Phase
      yield { event: "validating", message: "Validating document layout & quality..." };
      const validationReport = this.validator.validateAndRepair(specHtml, {
        plan: updatedPlan,
      });

      // 5. Saving Phase
      yield { event: "saving", message: "Persisting changes to project timeline..." };

      const nextRevNum = await this.historyService.getNextRevisionNumber(projectId);

      const generatorMeta = {
        model: project.aiModel || "gemini-2.5-flash",
        promptStyle: "rich",
        durationMs: 0,
        outputLength: validationReport.html.length,
        generatedAt: new Date().toISOString(),
      };

      const finalMeta = {
        plan: updatedPlan,
        generatorMeta,
        validation: {
          valid: validationReport.valid,
          repaired: validationReport.repaired,
          issues: validationReport.issues,
        },
        planDiff,
      };

      // Record revision
      await db.insert(projectRevisions).values({
        projectId,
        userId,
        revisionNumber: nextRevNum,
        prompt,
        plan: updatedPlan,
        html: validationReport.html,
        css: project.generatedCss || "",
        meta: finalMeta,
      });

      // Update parent project
      await db
        .update(projects)
        .set({
          generatedHtml: validationReport.html,
          generatedMeta: finalMeta,
          prompt: `${project.prompt}\n\n[Edit Request v${nextRevNum}]: ${prompt}`,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      // Record timeline event
      await this.historyService.recordTimelineEvent({
        projectId,
        userId,
        eventType: "edited",
        eventMetadata: {
          revisionNumber: nextRevNum,
          prompt,
          planDiff,
        },
      });

      yield {
        event: "complete",
        html: validationReport.html,
        projectId,
      };
    } catch (err: any) {
      yield {
        event: "error",
        message: err.message || "Failed to process revision request",
      };
    }
  }

  /**
   * Restores a project to a specific revision by version ID.
   */
  public async restoreRevision(projectId: string, userId: string, revisionId: string) {
    const revision = await this.historyService.getRevisionById(revisionId);
    if (!revision) {
      throw new Error("Revision not found");
    }

    if (revision.projectId !== projectId) {
      throw new Error("Revision does not belong to this project");
    }

    // Update parent project
    await db
      .update(projects)
      .set({
        generatedHtml: revision.html,
        generatedMeta: {
          plan: revision.plan as Plan,
          generatorMeta: (revision.meta as any)?.generatorMeta || {},
          validation: (revision.meta as any)?.validation || { valid: true, repaired: false, issues: [] },
        },
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    // Add corresponding timeline event
    await this.historyService.recordTimelineEvent({
      projectId,
      userId,
      eventType: "edited",
      eventMetadata: {
        action: "restored",
        toRevisionNumber: revision.revisionNumber,
        prompt: revision.prompt,
      },
    });

    return revision;
  }
}
