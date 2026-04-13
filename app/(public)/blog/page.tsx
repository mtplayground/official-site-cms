import Link from "next/link";
import { PostStatus } from "@prisma/client";

import { PostCard } from "@/components/site/post-card";
import { db } from "@/lib/db";

const POSTS_PER_PAGE = 10;

type BlogPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function parsePage(value: string | undefined) {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function pageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const requestedPage = parsePage(params?.page);

  const where = {
    status: PostStatus.PUBLISHED,
    publishedAt: {
      not: null,
    },
  } as const;

  const totalPosts = await db.blogPost.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const posts = await db.blogPost.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip,
    take: POSTS_PER_PAGE,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  });

  return (
    <main className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Blog</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Latest Insights</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Explore published updates, delivery learnings, and practical guidance from the autonomous software team.
          </p>
        </header>

        {posts.length > 0 ? (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  coverImageUrl={post.coverImageUrl}
                  publishedAt={post.publishedAt ?? new Date()}
                />
              ))}
            </section>

            {totalPages > 1 ? (
              <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Pagination">
                <Link
                  href={pageHref(currentPage - 1)}
                  aria-disabled={currentPage <= 1}
                  className="rounded-md border border-border px-3 py-2 text-sm text-foreground disabled:pointer-events-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  Previous
                </Link>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Link
                    key={page}
                    href={pageHref(page)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      page === currentPage
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  href={pageHref(currentPage + 1)}
                  aria-disabled={currentPage >= totalPages}
                  className="rounded-md border border-border px-3 py-2 text-sm text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  Next
                </Link>
              </nav>
            ) : null}
          </>
        ) : (
          <section className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
            No published blog posts yet.
          </section>
        )}
      </div>
    </main>
  );
}
