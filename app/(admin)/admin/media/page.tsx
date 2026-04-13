import { unlink } from "fs/promises";
import path from "path";

import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CopyUrlButton } from "@/components/admin/copy-url-button";
import { db } from "@/lib/db";

async function deleteMediaAction(formData: FormData) {
  "use server";

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/media");
  }

  const mediaId = formData.get("mediaId");

  if (typeof mediaId !== "string" || !mediaId) {
    redirect("/admin/media?error=invalid-media");
  }

  const media = await db.media.findUnique({
    where: { id: mediaId },
    select: {
      id: true,
      path: true,
    },
  });

  if (!media) {
    redirect("/admin/media?error=invalid-media");
  }

  await db.media.delete({ where: { id: media.id } });

  const uploadsRoot = path.resolve(process.cwd(), "uploads");
  const absolutePath = path.resolve(uploadsRoot, ...media.path.split("/"));

  if (absolutePath.startsWith(uploadsRoot)) {
    try {
      await unlink(absolutePath);
    } catch {
      // File already missing should not block metadata cleanup.
    }
  }

  revalidatePath("/admin/media");
  redirect("/admin/media?deleted=1");
}

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

type MediaPageProps = {
  searchParams?: Promise<{
    uploaded?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const params = await searchParams;

  const mediaList = await db.media.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      filename: true,
      path: true,
      size: true,
      createdAt: true,
    },
  });

  const uploaded = params?.uploaded === "1";
  const deleted = params?.deleted === "1";
  const error = params?.error;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground">Upload and manage local image assets.</p>
        </div>
      </div>

      {uploaded ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Image uploaded successfully.
        </p>
      ) : null}

      {deleted ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Image deleted successfully.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Unable to process media request.
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-foreground">Upload Image</h2>
        <form action="/api/upload" method="post" encType="multipart/form-data" className="space-y-4">
          <input type="hidden" name="redirectTo" value="/admin/media" />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Upload
          </button>
        </form>
      </section>

      <section className="space-y-3">
        {mediaList.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mediaList.map((media) => {
              const imageUrl = `/api/uploads/${media.path}`;

              return (
                <article key={media.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                  <div className="aspect-video w-full bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt={media.filename} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{media.filename}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(media.size)}</p>
                    </div>

                    <div className="rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                      {imageUrl}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <CopyUrlButton url={imageUrl} />
                      <Link href={imageUrl} target="_blank" className="text-sm text-primary hover:underline">
                        Open
                      </Link>
                      <form action={deleteMediaAction}>
                        <input type="hidden" name="mediaId" value={media.id} />
                        <button type="submit" className="text-sm text-destructive hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-md border border-border bg-card px-4 py-5 text-sm text-muted-foreground">
            No media uploaded yet.
          </p>
        )}
      </section>
    </div>
  );
}
