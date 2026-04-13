import Link from "next/link";
import { notFound } from "next/navigation";
import { PostStatus } from "@prisma/client";

import { updatePostAction } from "@/actions/posts";
import { PostForm } from "@/components/admin/post-form";
import { db } from "@/lib/db";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
  const { id } = await params;
  const pageParams = await searchParams;

  const post = await db.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      bodyMarkdown: true,
      coverImageUrl: true,
      status: true,
    },
  });

  if (!post) {
    notFound();
  }

  const error = pageParams?.error;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Post</h1>
          <p className="text-sm text-muted-foreground">Update post details and Markdown body.</p>
        </div>
        <Link href="/admin/posts" className="text-sm font-medium text-primary hover:underline">
          Back to posts
        </Link>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error === "slug-exists"
            ? "Slug already exists. Please choose another slug."
            : "Unable to update post. Please check your input and try again."}
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <PostForm
          action={updatePostAction.bind(null, post.id)}
          submitLabel="Update Post"
          autoGenerateSlug={false}
          initialValues={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            bodyMarkdown: post.bodyMarkdown,
            coverImageUrl: post.coverImageUrl ?? "",
            isPublished: post.status === PostStatus.PUBLISHED,
          }}
        />
      </section>
    </div>
  );
}
