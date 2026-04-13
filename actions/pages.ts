"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isEditablePageSlug, PAGE_SLUGS } from "@/lib/page-content";

function readStringField(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/pages");
  }
}

function readLandingSections(formData: FormData) {
  return {
    heroTagline: readStringField(formData, "heroTagline"),
    heroHeadline: readStringField(formData, "heroHeadline"),
    heroDescription: readStringField(formData, "heroDescription"),
    stats: [
      {
        value: readStringField(formData, "stat1Value"),
        label: readStringField(formData, "stat1Label"),
      },
      {
        value: readStringField(formData, "stat2Value"),
        label: readStringField(formData, "stat2Label"),
      },
      {
        value: readStringField(formData, "stat3Value"),
        label: readStringField(formData, "stat3Label"),
      },
      {
        value: readStringField(formData, "stat4Value"),
        label: readStringField(formData, "stat4Label"),
      },
    ],
    ctaHeading: readStringField(formData, "ctaHeading"),
    ctaDescription: readStringField(formData, "ctaDescription"),
  };
}

export async function updatePageContentAction(slug: string, formData: FormData) {
  await requireAuth();

  if (!isEditablePageSlug(slug)) {
    redirect("/admin/pages?error=invalid-page");
  }

  const title = readStringField(formData, "title") || null;

  if (slug === PAGE_SLUGS.ABOUT) {
    const bodyMarkdown = readStringField(formData, "bodyMarkdown");

    await db.pageContent.upsert({
      where: { slug },
      update: {
        title,
        bodyMarkdown,
        sectionsJson: Prisma.JsonNull,
      },
      create: {
        slug,
        title,
        bodyMarkdown,
        sectionsJson: Prisma.JsonNull,
      },
    });
  } else {
    const sections = readLandingSections(formData);

    await db.pageContent.upsert({
      where: { slug },
      update: {
        title,
        bodyMarkdown: null,
        sectionsJson: sections,
      },
      create: {
        slug,
        title,
        bodyMarkdown: null,
        sectionsJson: sections,
      },
    });
  }

  revalidatePath("/admin/pages");
  revalidatePath("/");
  revalidatePath("/about");

  redirect(`/admin/pages?updated=${slug}`);
}
