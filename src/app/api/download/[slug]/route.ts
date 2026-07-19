import { Readable } from "node:stream";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isApplicationError } from "@/lib/errors/application-error";
import { downloadService } from "@/services/download.service";
import { registrationCookieName } from "@/types/registration";

export const runtime = "nodejs";

function errorResponse(code: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      code,
    },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const token = request.cookies.get(registrationCookieName)?.value;

  try {
    const download = await downloadService.prepareBrochureDownload(slug, token);
    const body = Readable.toWeb(download.stream) as ReadableStream;

    return new Response(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${download.filename}"`,
        "Content-Length": String(download.contentLength),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    if (isApplicationError(error)) {
      if (error.code === "DOWNLOAD_UNAUTHORIZED") {
        return errorResponse("DOWNLOAD_UNAUTHORIZED", 401);
      }

      if (error.code === "PROJECT_NOT_FOUND") {
        return errorResponse("PROJECT_NOT_FOUND", 404);
      }

      if (error.code === "BROCHURE_NOT_AVAILABLE") {
        return errorResponse("BROCHURE_NOT_AVAILABLE", 404);
      }

      if (error.code === "FILE_NOT_FOUND") {
        return errorResponse("FILE_NOT_FOUND", 404);
      }
    }

    console.error("Unexpected brochure download error");
    return errorResponse("INTERNAL_ERROR", 500);
  }
}
