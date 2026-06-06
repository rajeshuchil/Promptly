import { NextResponse } from "next/server";
import { DeployService } from "@/lib/deploy/deploy-service";
import { ProjectService } from "@/lib/projects/project-service";

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
  try {
    const { id } = await params;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          const deployService = DeployService.getInstance();
          const deployStream = deployService.deployStream(id);

          for await (const step of deployStream) {
            sendEvent("progress", step);
          }
        } catch (error: any) {
          // Update project table with failure state
          try {
            const projectService = ProjectService.getInstance();
            await projectService.updateProject(id, {
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
