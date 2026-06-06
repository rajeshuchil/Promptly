import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/projects/project-service";
import { requireUser } from "@/lib/auth";

/**
 * GET /api/projects
 *
 * Retrieve all active (non-archived) projects for the authenticated user.
 */
export async function GET() {
  try {
    const user = await requireUser();
    const projectService = ProjectService.getInstance();
    const projects = await projectService.getProjectsByUser(user.id);

    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve projects";
    const status = message.includes("Unauthorized") ? 401 : 500;
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
        },
      },
      { status }
    );
  }
}
