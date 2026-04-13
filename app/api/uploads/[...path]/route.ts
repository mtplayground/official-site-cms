import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function isSafeSegment(value: string) {
  return /^[a-zA-Z0-9._-]+$/.test(value);
}

export async function GET(_request: Request, context: RouteContext) {
  const { path: requestedSegments } = await context.params;

  if (!Array.isArray(requestedSegments) || requestedSegments.length === 0) {
    return NextResponse.json({ error: "File path is required." }, { status: 400 });
  }

  if (!requestedSegments.every(isSafeSegment)) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  const uploadsRoot = path.resolve(process.cwd(), "uploads");
  const relativePath = requestedSegments.join("/");
  const absolutePath = path.resolve(uploadsRoot, ...requestedSegments);

  if (!absolutePath.startsWith(uploadsRoot)) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  let fileBuffer: Buffer;

  try {
    fileBuffer = await readFile(absolutePath);
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const media = await db.media.findUnique({
    where: { path: relativePath },
    select: { mimeType: true },
  });

  const extension = path.extname(absolutePath).toLowerCase();
  const contentType = media?.mimeType ?? MIME_BY_EXTENSION[extension] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
