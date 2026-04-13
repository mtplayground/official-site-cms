import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { db } from "@/lib/db";
import { resolveAboutContent } from "@/lib/markdown";
import { PAGE_SLUGS } from "@/lib/page-content";

export default async function AboutPage() {
  const aboutRecord = await db.pageContent.findUnique({
    where: { slug: PAGE_SLUGS.ABOUT },
    select: {
      title: true,
      bodyMarkdown: true,
    },
  });

  const { title, bodyMarkdown } = resolveAboutContent(aboutRecord);

  return (
    <main className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">About</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        </header>

        <article className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => <h2 className="mt-8 text-2xl font-semibold text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="mt-6 text-xl font-semibold text-foreground">{children}</h3>,
              p: ({ children }) => <p>{children}</p>,
              ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              a: ({ children, href }) => (
                <a href={href} className="text-primary underline underline-offset-2 hover:opacity-90">
                  {children}
                </a>
              ),
              code: ({ children }) => <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">{children}</code>,
            }}
          >
            {bodyMarkdown}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
