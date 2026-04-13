import type { MetadataRoute } from "next";
import { PostStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/structured-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const posts = await db.blogPost.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      publishedAt: {
        not: null,
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticRoutes, ...postRoutes];
}
