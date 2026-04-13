export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:8080";

  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

type BlogPostStructuredDataInput = {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  modifiedAt: Date;
  image?: string | null;
};

export function buildBlogPostStructuredData(input: BlogPostStructuredDataInput) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt.toISOString(),
    dateModified: input.modifiedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    image: input.image || `${siteUrl}/og-image.png`,
    author: {
      "@type": "Organization",
      name: "myclawteam.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "myclawteam.ai",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
  };
}
