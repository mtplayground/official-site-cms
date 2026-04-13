"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  coverImageUrl: string;
  isPublished: boolean;
};

type PostFormProps = {
  action: (formData: FormData) => void;
  submitLabel: string;
  initialValues?: Partial<PostFormValues>;
  autoGenerateSlug?: boolean;
};

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function PostForm({ action, submitLabel, initialValues, autoGenerateSlug = true }: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [isPublished, setIsPublished] = useState(initialValues?.isPublished ?? false);
  const [allowAutoSlug, setAllowAutoSlug] = useState(autoGenerateSlug);

  function handleTitleChange(nextTitle: string) {
    setTitle(nextTitle);

    if (allowAutoSlug) {
      setSlug(toSlug(nextTitle));
    }
  }

  function handleSlugChange(nextSlug: string) {
    setAllowAutoSlug(false);
    setSlug(toSlug(nextSlug));
  }

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Post title"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium text-foreground">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(event) => handleSlugChange(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="post-slug"
        />
        <p className="text-xs text-muted-foreground">URL path will use this slug.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-medium text-foreground">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={initialValues?.excerpt ?? ""}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Short summary shown in lists"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bodyMarkdown" className="text-sm font-medium text-foreground">
          Markdown Body
        </label>
        <textarea
          id="bodyMarkdown"
          name="bodyMarkdown"
          rows={14}
          required
          defaultValue={initialValues?.bodyMarkdown ?? ""}
          className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="# Heading\n\nWrite your post in Markdown..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="coverImageUrl" className="text-sm font-medium text-foreground">
          Cover Image URL
        </label>
        <input
          id="coverImageUrl"
          name="coverImageUrl"
          type="text"
          defaultValue={initialValues?.coverImageUrl ?? ""}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="/uploads/cover.jpg"
        />
      </div>

      <label className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
        <input
          type="checkbox"
          name="isPublished"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm text-foreground">{isPublished ? "Published" : "Save as Draft"}</span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} />
        <Link href="/admin/posts" className="text-sm text-muted-foreground hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
