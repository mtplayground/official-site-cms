import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="mt-8 text-3xl font-semibold text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-8 text-2xl font-semibold text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 text-xl font-semibold text-foreground">{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="rounded-r-md border-l-4 border-primary bg-muted/40 px-4 py-2 italic text-foreground/90">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-primary underline underline-offset-2 hover:opacity-90">
              {children}
            </a>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg border border-border bg-slate-950 p-4 text-sm text-slate-100">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const hasLanguageClass = Boolean(className?.includes("language-"));

            if (hasLanguageClass) {
              return <code className={className}>{children}</code>;
            }

            return <code className="rounded bg-muted px-1 py-0.5 text-sm text-foreground">{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
