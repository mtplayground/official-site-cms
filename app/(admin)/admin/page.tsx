import { PostStatus } from "@prisma/client";

import { db } from "@/lib/db";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

export default async function AdminDashboardPage() {
  const [postCount, draftCount, recentPosts] = await Promise.all([
    db.blogPost.count(),
    db.blogPost.count({ where: { status: PostStatus.DRAFT } }),
    db.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of blog content activity.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{postCount}</p>
        </article>
        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Draft Posts</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{draftCount}</p>
        </article>
      </section>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">Recent Posts</h2>
        </div>

        <div className="divide-y divide-border">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{post.title}</p>
                  <p className="text-xs text-muted-foreground">Updated {formatDate(post.updatedAt)}</p>
                </div>
                <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground">
                  {post.status}
                </span>
              </div>
            ))
          ) : (
            <p className="px-5 py-6 text-sm text-muted-foreground">No posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
