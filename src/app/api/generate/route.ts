import { NextResponse } from "next/server";
import { PlannerService } from "@/lib/ai/planner/planner";
import { GeneratorService } from "@/lib/ai/generator/generator";
import { HtmlValidator } from "@/lib/ai/validator/validator";
import { ProjectService } from "@/lib/projects/project-service";
import { GenerateRequestSchema } from "@/lib/ai/generator/schemas";
import { AIError } from "@/lib/ai/types";

export async function POST(request: Request) {
  // ── 1. Validate request body ───────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Request body must be valid JSON", phase: "validation" },
      },
      { status: 400 }
    );
  }

  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Invalid request payload",
          details: parsed.error.flatten(),
          phase: "validation",
        },
      },
      { status: 400 }
    );
  }

  const { prompt, style } = parsed.data;

  // ── 2. Run Planner ─────────────────────────────────────────────────────────
  let plan;
  try {
    const plannerService = PlannerService.getInstance();
    plan = await plannerService.generatePlanWithRetry(prompt, 2);
  } catch (error) {
    if (error instanceof AIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            phase: "planning",
          },
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: { message: "Planning phase encountered an unexpected error", phase: "planning" },
      },
      { status: 500 }
    );
  }

  // ── 3. Run Generator ───────────────────────────────────────────────────────
  let generatorOutput;
  try {
    const generatorService = GeneratorService.getInstance();
    generatorOutput = await generatorService.generateWithRetry(
      { prompt, plan },
      2,
      { style }
    );
  } catch (error) {
    if (error instanceof AIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            phase: "generation",
          },
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Generation phase encountered an unexpected error",
          phase: "generation",
        },
      },
      { status: 500 }
    );
  }

  // ── 4. Run Validator & Repair ──────────────────────────────────────────────
  const validator = HtmlValidator.getInstance();
  const validationReport = validator.validateAndRepair(generatorOutput.html);

  if (!validationReport.valid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Generated website failed HTML validation and could not be repaired",
          phase: "validation",
          validation: {
            valid: validationReport.valid,
            repaired: validationReport.repaired,
            issues: validationReport.issues,
          },
        },
      },
      { status: 422 }
    );
  }

  // ── 5. Persist Generation results in Database ──────────────────────────────
  let project;
  try {
    const projectService = ProjectService.getInstance();
    const userId = await projectService.getOrCreateDefaultUser();

    // Derive a clean human-readable name from plan or prompt
    const capitalizedType = plan.pageType
      ? plan.pageType.charAt(0).toUpperCase() + plan.pageType.slice(1)
      : "Landing Page";
    const projectName = `FastApp ${capitalizedType} - ${style}`;

    // Structure metadata cleanly
    const generatedMeta = {
      plan,
      generatorMeta: generatorOutput.meta,
      validation: {
        valid: validationReport.valid,
        repaired: validationReport.repaired,
        issues: validationReport.issues,
      },
    };

    project = await projectService.createProject({
      userId,
      name: projectName,
      prompt,
      generatedHtml: validationReport.html,
      generatedMeta,
      deploymentState: "generated",
      aiModel: generatorOutput.meta.model,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: `Persistence phase failed: ${error instanceof Error ? error.message : String(error)}`,
          phase: "persistence",
        },
      },
      { status: 500 }
    );
  }

  // ── 6. Return Success ──────────────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      plan,
      validation: {
        valid: validationReport.valid,
        repaired: validationReport.repaired,
        issues: validationReport.issues,
        html: validationReport.html,
      },
      html: validationReport.html,
      projectId: project.id,
    },
    { status: 200 }
  );
}

