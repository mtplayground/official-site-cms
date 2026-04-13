import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

function sanitizeBaseName(value: string) {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "image";
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image must be between 1 byte and 10MB." }, { status: 400 });
  }

  const extension = EXT_BY_MIME[file.type] ?? (path.extname(file.name).toLowerCase() || ".bin");
  const now = new Date();
  const folder = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const uploadsRoot = path.join(process.cwd(), "uploads");
  const uploadDir = path.join(uploadsRoot, ...folder.split("/"));

  await mkdir(uploadDir, { recursive: true });

  const safeBaseName = sanitizeBaseName(file.name);
  const fileName = `${Date.now()}-${randomUUID()}-${safeBaseName}${extension}`;
  const relativePath = path.posix.join(folder, fileName);
  const absolutePath = path.join(uploadsRoot, ...relativePath.split("/"));

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  const media = await db.media.create({
    data: {
      filename: file.name,
      path: relativePath,
      mimeType: file.type,
      size: file.size,
    },
    select: {
      id: true,
      filename: true,
      path: true,
      mimeType: true,
      size: true,
      createdAt: true,
    },
  });

  const imageUrl = `/api/uploads/${relativePath}`;
  const redirectTo = formData.get("redirectTo");

  if (typeof redirectTo === "string" && redirectTo.startsWith("/")) {
    const target = new URL(redirectTo, request.url);
    target.searchParams.set("uploaded", "1");
    return NextResponse.redirect(target, { status: 303 });
  }

  return NextResponse.json({
    media,
    url: imageUrl,
  });
}
