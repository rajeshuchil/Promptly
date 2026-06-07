import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/projects/project-service";
import { requireUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/projects/[id]
 *
 * Retrieve a project by its unique ID, verifying user ownership.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const projectService = ProjectService.getInstance();
    const project = await projectService.getProjectById(id, user.id);

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve project";
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

/**
 * DELETE /api/projects/[id]
 *
 * Delete a project by its unique ID, verifying user ownership.
 */
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const projectService = ProjectService.getInstance();
    await projectService.deleteProject(id, user.id);

    return NextResponse.json(
      { success: true, message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
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

/**
 * PATCH /api/projects/[id]
 *
 * Update project details (rename name, update isFavorite status, etc.)
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json();
    const projectService = ProjectService.getInstance();
    
    const project = await projectService.updateProject(id, user.id, {
      name: body.name,
      isFavorite: body.isFavorite,
    });

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update project";
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
