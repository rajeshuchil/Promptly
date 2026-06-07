import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema/projects";
import { eq, and } from "drizzle-orm";
import { HistoryService } from "@/lib/iterations/history-service";
import { IterationService } from "@/lib/iterations/iteration-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/projects/[id]/revisions
 *
 * Retrieve all revisions of a project.
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
  const revisions = await historyService.getRevisions(projectId);

  return NextResponse.json({ success: true, revisions }, { status: 200 });
}

/**
 * POST /api/projects/[id]/revisions
 *
 * Restore a specific revision.
 */
export async function POST(request: Request, { params }: RouteContext) {
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

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const { revisionId } = body;
  if (!revisionId) {
    return NextResponse.json(
      { success: false, error: { message: "Missing revisionId" } },
      { status: 400 }
    );
  }

  try {
    const iterationService = IterationService.getInstance();
    const restored = await iterationService.restoreRevision(projectId, user.id, revisionId);

    return NextResponse.json(
      { success: true, message: "Revision restored successfully", revision: restored },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to restore revision" } },
      { status: 500 }
    );
  }
}
