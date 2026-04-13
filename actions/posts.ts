"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function deletePostAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/posts");
  }

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
