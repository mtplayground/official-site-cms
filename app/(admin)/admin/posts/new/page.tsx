import Link from "next/link";

import { createPostAction } from "@/actions/posts";
import { PostForm } from "@/components/admin/post-form";

type NewPostPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Post</h1>
          <p className="text-sm text-muted-foreground">Create a new blog post with Markdown content.</p>
        </div>
        <Link href="/admin/posts" className="text-sm font-medium text-primary hover:underline">
          Back to posts
        </Link>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error === "slug-exists"
            ? "Slug already exists. Please choose another slug."
            : "Unable to create post. Please check your input and try again."}
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <PostForm action={createPostAction} submitLabel="Create Post" autoGenerateSlug />
      </section>
    </div>
  );
}
