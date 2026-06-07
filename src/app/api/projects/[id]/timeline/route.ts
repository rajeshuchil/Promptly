import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema/projects";
import { eq, and } from "drizzle-orm";
import { HistoryService } from "@/lib/iterations/history-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/projects/[id]/timeline
 *
 * Retrieve the lifecycle timeline events of a project.
 */
export async function GET(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const { id: projectId } = await params;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
    .limit(1);

  if (!project) {
    return NextResponse.json(
      { success: false, error: { message: "Project not found or unauthorized" } },
      { status: 404 }
    );
  }

  const historyService = HistoryService.getInstance();
  const timeline = await historyService.getTimelineEvents(projectId);

  return NextResponse.json({ success: true, timeline }, { status: 200 });
}
