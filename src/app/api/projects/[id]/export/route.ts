import { NextResponse } from "next/server";
import { ExportService } from "@/lib/export/export-service";
import { ExportRequestSchema } from "@/lib/export/schemas";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/projects/[id]/export?format=html|zip
 *
 * Downloads the project source code in the specified format.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    // Parse format query param
    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get("format") || "html";

    const parsed = ExportRequestSchema.safeParse({ format: formatParam });
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Invalid export format: '${formatParam}'`,
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { format } = parsed.data;

    const exportService = ExportService.getInstance();
    const result = await exportService.exportProject(id, format);

    // Construct headers for file download
    const headers = new Headers();
    headers.set("Content-Type", result.contentType);
    headers.set("Content-Disposition", `attachment; filename="${result.filename}"`);
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

    const bodyInit = typeof result.data === "string"
      ? result.data
      : new Uint8Array(result.data);

    return new Response(bodyInit, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    const statusCode = error.statusCode ?? 500;
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Export process failed",
        },
      },
      { status: statusCode }
    );
  }
}
