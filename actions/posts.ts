"use server";

import { PostStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";

type PostPayload = {
  title: string;
  slug: string;
  excerpt: string | null;
  bodyMarkdown: string;
  coverImageUrl: string | null;
  status: PostStatus;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/posts");
  }
}

function readPostPayload(formData: FormData): PostPayload | null {
  const titleValue = formData.get("title");
  const slugValue = formData.get("slug");
  const excerptValue = formData.get("excerpt");
  const markdownValue = formData.get("bodyMarkdown");
  const coverImageValue = formData.get("coverImageUrl");

  if (typeof titleValue !== "string" || typeof markdownValue !== "string") {
    return null;
  }

  const title = titleValue.trim();
  const baseSlug = typeof slugValue === "string" && slugValue.trim() ? slugValue : title;
  const slug = normalizeSlug(baseSlug);
  const bodyMarkdown = markdownValue.trim();

  if (!title || !slug || !bodyMarkdown) {
    return null;
  }

  const excerpt = typeof excerptValue === "string" && excerptValue.trim() ? excerptValue.trim() : null;
  const coverImageUrl =
    typeof coverImageValue === "string" && coverImageValue.trim() ? coverImageValue.trim() : null;
  const status = formData.get("isPublished") === "on" ? PostStatus.PUBLISHED : PostStatus.DRAFT;

  return {
    title,
    slug,
    excerpt,
    bodyMarkdown,
    coverImageUrl,
    status,
  };
}

function isUniqueSlugError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes("slug")
  );
}

export async function createPostAction(formData: FormData) {
  await requireAuth();

  const payload = readPostPayload(formData);

  if (!payload) {
    redirect("/admin/posts/new?error=invalid-input");
  }

  try {
    await db.blogPost.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        bodyMarkdown: payload.bodyMarkdown,
        coverImageUrl: payload.coverImageUrl,
        status: payload.status,
        publishedAt: payload.status === PostStatus.PUBLISHED ? new Date() : null,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect("/admin/posts/new?error=slug-exists");
    }

    redirect("/admin/posts/new?error=create-failed");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect("/admin/posts?created=1");
}

export async function updatePostAction(postId: string, formData: FormData) {
  await requireAuth();

  if (!postId) {
    redirect("/admin/posts?error=invalid-post");
  }

  const payload = readPostPayload(formData);

  if (!payload) {
    redirect(`/admin/posts/${encodeURIComponent(postId)}/edit?error=invalid-input`);
  }

  const existingPost = await db.blogPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      publishedAt: true,
    },
  });

  if (!existingPost) {
    redirect("/admin/posts?error=invalid-post");
  }

  const nextPublishedAt =
    payload.status === PostStatus.PUBLISHED ? (existingPost.publishedAt ?? new Date()) : null;

  try {
    await db.blogPost.update({
      where: { id: postId },
      data: {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        bodyMarkdown: payload.bodyMarkdown,
        coverImageUrl: payload.coverImageUrl,
        status: payload.status,
        publishedAt: nextPublishedAt,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(`/admin/posts/${encodeURIComponent(postId)}/edit?error=slug-exists`);
    }

    redirect(`/admin/posts/${encodeURIComponent(postId)}/edit?error=update-failed`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect("/admin/posts?updated=1");
}

export async function deletePostAction(formData: FormData) {
  await requireAuth();

  const postId = formData.get("postId");
  const confirmed = formData.get("confirmed");

  if (typeof postId !== "string" || !postId) {
    redirect("/admin/posts?error=invalid-post");
  }

  if (confirmed !== "yes") {
    redirect(`/admin/posts?confirm=${encodeURIComponent(postId)}`);
  }

  try {
    await db.blogPost.delete({
      where: { id: postId },
    });
  } catch {
    redirect("/admin/posts?error=delete-failed");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect("/admin/posts?deleted=1");
}
