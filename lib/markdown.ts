import { PAGE_SLUGS } from "@/lib/page-content";

export const ABOUT_PAGE_FALLBACK = {
  slug: PAGE_SLUGS.ABOUT,
  title: "About myclawteam.ai",
  bodyMarkdown: `## Building The Autonomous Software Team\n\nmyclawteam.ai helps engineering organizations move from AI experimentation to reliable production outcomes.\n\n### What We Focus On\n\n- **Delivery acceleration** with autonomous workflows\n- **Quality gates** that verify generated changes before release\n- **Operational resilience** through repeatable, observable systems\n\n### How We Work\n\nWe combine strategy, implementation, and verification into one continuous delivery loop so teams can ship faster without trading away confidence.`,
} as const;

type AboutRecord = {
  title?: string | null;
  bodyMarkdown?: string | null;
};

export function resolveAboutContent(record: AboutRecord | null | undefined) {
  const title = record?.title?.trim() || ABOUT_PAGE_FALLBACK.title;
  const bodyMarkdown = record?.bodyMarkdown?.trim() || ABOUT_PAGE_FALLBACK.bodyMarkdown;

  return {
    title,
    bodyMarkdown,
  };
}

export function estimateReadingTime(markdown: string) {
  const words = markdown
    .trim()
    .replace(/[`*_>#-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function markdownToExcerpt(markdown: string, maxLength = 160) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/[#>*_\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength - 1)}…`;
}
