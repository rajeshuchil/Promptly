import { NextResponse } from "next/server";
import { DeploymentService } from "@/lib/deployments/deployment-service";
import { ProjectService } from "@/lib/projects/project-service";
import { getCurrentUser } from "@/lib/auth";
import { EntitlementsService } from "@/lib/billing";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

/**
 * POST /api/projects/[id]/deploy
 *
 * Deploys the project to FastApp edge servers. Streams build progress via SSE.
 */
export async function POST(request: Request, { params }: RouteContext) {
  // Check auth before starting the deploy stream
  const user = await getCurrentUser();
  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: "Unauthorized: Authentication required" },
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check deploy capability using entitlements service
  const entitlementsService = EntitlementsService.getInstance();
  const check = await entitlementsService.canDeploy(user.id);
  if (!check.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: check.message },
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { id } = await params;
    
    // Parse provider selection if specified in request url/body
    const urlObj = new URL(request.url);
    const providerName = urlObj.searchParams.get("provider") || "mock";

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          const deploymentService = DeploymentService.getInstance();
          const deployStream = deploymentService.deployStream(id, user.id, providerName);

          for await (const step of deployStream) {
            sendEvent("progress", step);
          }
        } catch (error: any) {
          // Update project table with failure state
          try {
            const projectService = ProjectService.getInstance();
            await projectService.updateProject(id, user.id, {
              deploymentState: "failed",
              errorMessage: error.message || "Deployment execution failed",
            });
          } catch {}

          sendEvent("error", {
            message: error instanceof Error ? error.message : "Deployment failed",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Failed to initiate deployment",
        },
      },
      { status: 500 }
    );
  }
}
