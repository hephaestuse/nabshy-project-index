import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getProjectImagesDirectory } from "@/lib/files/file-storage";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;

  if (
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("..")
  ) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const extension = path.extname(filename).toLowerCase();
  const contentType = contentTypes[extension];

  if (!contentType) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const directory = getProjectImagesDirectory();
  const filePath = path.resolve(directory, filename);
  const relativePath = path.relative(directory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const fileStats = await stat(filePath).catch(() => null);

  if (!fileStats?.isFile()) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return new Response(Readable.toWeb(createReadStream(filePath)) as ReadableStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(fileStats.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
