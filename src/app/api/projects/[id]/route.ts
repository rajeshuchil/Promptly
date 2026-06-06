import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/projects/project-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/projects/[id]
 *
 * Retrieve a project by its unique ID.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const projectService = ProjectService.getInstance();
    const project = await projectService.getProjectById(id);

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    const statusCode = (error as any).statusCode ?? 500;
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Failed to retrieve project",
        },
      },
      { status: statusCode }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 *
 * Delete a project by its unique ID.
 */
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const projectService = ProjectService.getInstance();
    await projectService.deleteProject(id);

    return NextResponse.json(
      { success: true, message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const statusCode = (error as any).statusCode ?? 500;
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Failed to delete project",
        },
      },
      { status: statusCode }
    );
  }
}
