import Link from "next/link";

import { deletePostAction } from "@/actions/posts";
import { db } from "@/lib/db";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

type PostsPageProps = {
  searchParams?: Promise<{
    confirm?: string;
    deleted?: string;
    created?: string;
    updated?: string;
    error?: string;
  }>;
};

export default async function AdminPostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;

  const posts = await db.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  const confirmPostId = params?.confirm;
  const deleted = params?.deleted === "1";
  const created = params?.created === "1";
  const updated = params?.updated === "1";
  const deleteError = params?.error === "delete-failed";
  const invalidPostError = params?.error === "invalid-post";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Manage draft and published blog content.</p>
        </div>
        <Link href="/admin/posts/new" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          New Post
        </Link>
      </div>

      {created ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Post created successfully.
        </p>
      ) : null}

      {updated ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Post updated successfully.
        </p>
      ) : null}

      {deleted ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Post deleted successfully.
        </p>
      ) : null}

      {deleteError || invalidPostError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {invalidPostError ? "Invalid post selected." : "Unable to delete the selected post."}
        </p>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.length > 0 ? (
                posts.map((post) => {
                  const isConfirming = confirmPostId === post.id;
                  const displayDate = post.publishedAt ?? post.updatedAt;

                  return (
                    <tr key={post.id} className="align-top">
                      <td className="px-5 py-4 font-medium text-foreground">{post.title}</td>
                      <td className="px-5 py-4 text-muted-foreground">{post.status}</td>
                      <td className="px-5 py-4 text-muted-foreground">{formatDate(displayDate)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Edit
                          </Link>

                          {isConfirming ? (
                            <form action={deletePostAction} className="flex items-center gap-2">
                              <input type="hidden" name="postId" value={post.id} />
                              <input type="hidden" name="confirmed" value="yes" />
                              <button
                                type="submit"
                                className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground"
                              >
                                Confirm delete
                              </button>
                              <Link href="/admin/posts" className="text-xs text-muted-foreground hover:underline">
                                Cancel
                              </Link>
                            </form>
                          ) : (
                            <Link
                              href={`/admin/posts?confirm=${encodeURIComponent(post.id)}`}
                              className="text-sm font-medium text-destructive hover:underline"
                            >
                              Delete
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
