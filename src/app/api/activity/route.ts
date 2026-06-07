import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();
    
    // 1. Fetch user's projects
    const projects = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.userId, user.id))
      .orderBy(desc(schema.projects.createdAt))
      .limit(10);

    // 2. Fetch user's usage logs
    const usageLogs = await db
      .select()
      .from(schema.usageLogs)
      .where(eq(schema.usageLogs.userId, user.id))
      .orderBy(desc(schema.usageLogs.createdAt))
      .limit(10);

    // 3. Consolidated activity feed
    const activities: any[] = [];

    // Map projects
    projects.forEach((proj) => {
      // Creation event
      activities.push({
        id: `proj-create-${proj.id}`,
        type: "project_created",
        title: "Project Initialized",
        description: `Project "${proj.name}" was created.`,
        timestamp: proj.createdAt,
        meta: { projectId: proj.id, name: proj.name },
      });

      // Deployment event if deployed
      if (proj.deploymentState === "deployed" && proj.deployedUrl) {
        activities.push({
          id: `proj-deploy-${proj.id}`,
          type: "deployment_completed",
          title: "Deployment Completed",
          description: `Project "${proj.name}" was deployed to fastapp.site.`,
          timestamp: proj.updatedAt,
          meta: { projectId: proj.id, name: proj.name, url: proj.deployedUrl },
        });
      }
    });

    // Map usage logs
    usageLogs.forEach((log) => {
      const isSuccess = log.status === "success";
      activities.push({
        id: `usage-log-${log.id}`,
        type: isSuccess ? "generation_completed" : "generation_failed",
        title: isSuccess ? `AI ${capitalize(log.phase)} Succeeded` : `AI ${capitalize(log.phase)} Failed`,
        description: isSuccess
          ? `Successfully processed ${log.phase} using model ${log.model}.`
          : `Failed during ${log.phase} using model ${log.model}: ${log.errorMessage || "Unknown error"}.`,
        timestamp: log.createdAt,
        meta: {
          phase: log.phase,
          model: log.model,
          estimatedCost: log.estimatedCost,
          totalTokens: log.totalTokens,
        },
      });
    });

    // 4. Sort consolidated feed descending by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Slice to top 10 recent items
    const recentActivity = activities.slice(0, 10);

    return NextResponse.json({ success: true, activity: recentActivity }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve activity log";
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

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
