import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/projects/project-service";
import { requireUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * POST /api/projects/[id]/duplicate
 *
 * Clones a project for the authenticated user, respecting ownership rules.
 */
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const projectService = ProjectService.getInstance();
    
    // 1. Fetch original project (verifies ownership automatically)
    const original = await projectService.getProjectById(id, user.id);
    
    // 2. Clone it by inserting a new project row
    const duplicated = await projectService.createProject({
      userId: user.id,
      name: `${original.name} (Copy)`,
      prompt: original.prompt,
      generatedHtml: original.generatedHtml ?? undefined,
      generatedCss: original.generatedCss ?? undefined,
      generatedMeta: original.generatedMeta ?? undefined,
      deploymentState: "idle",
      aiModel: original.aiModel ?? undefined,
      isFavorite: false,
    });

    return NextResponse.json({ success: true, project: duplicated }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to duplicate project";
    const statusCode = (error as any).statusCode ?? (message.includes("Unauthorized") ? 401 : 500);
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
        },
      },
      { status: statusCode }
    );
  }
}
