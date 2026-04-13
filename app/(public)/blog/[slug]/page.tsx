import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { estimateReadingTime, formatBlogDate, markdownToExcerpt } from "@/lib/markdown";
import { MarkdownRenderer } from "@/components/site/markdown-renderer";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPublishedPostBySlug(slug: string) {
  return db.blogPost.findFirst({
    where: {
      slug,
      status: PostStatus.PUBLISHED,
      publishedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      bodyMarkdown: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
      description: "This post is unavailable.",
    };
  }

  const description = post.excerpt?.trim() || markdownToExcerpt(post.bodyMarkdown);
  const title = `${post.title} | myclawteam.ai`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post || !post.publishedAt) {
    notFound();
  }

  const readingTime = estimateReadingTime(post.bodyMarkdown);

  return (
    <main className="px-4 py-16 sm:px-6 sm:py-20">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4">
          <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
            ← Back to blog
          </Link>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          {post.excerpt ? <p className="text-base text-muted-foreground">{post.excerpt}</p> : null}
        </header>

        {post.coverImageUrl ? (
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt={post.title} className="h-auto w-full object-cover" />
          </div>
        ) : null}

        <MarkdownRenderer content={post.bodyMarkdown} />
      </article>
    </main>
  );
}
