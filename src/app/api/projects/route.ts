import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/projects/project-service";

/**
 * GET /api/projects
 *
 * Retrieve all active (non-archived) projects for the default user.
 */
export async function GET() {
  try {
    const projectService = ProjectService.getInstance();
    const userId = await projectService.getOrCreateDefaultUser();
    const projects = await projectService.getProjectsByUser(userId);

    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Failed to retrieve projects",
        },
      },
      { status: 500 }
    );
  }
}
