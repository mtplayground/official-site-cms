import Link from "next/link";

type PostCardProps = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function PostCard({ slug, title, excerpt, coverImageUrl, publishedAt }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blog/${slug}`} className="block">
        {coverImageUrl ? (
          <div className="aspect-[16/9] w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImageUrl} alt={title} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-brand-100 to-sand-100" />
        )}

        <div className="space-y-3 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{formatDate(publishedAt)}</p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {excerpt?.trim() || "Read the full article for implementation insights and lessons learned."}
          </p>
          <p className="text-sm font-medium text-primary">Read post →</p>
        </div>
      </Link>
    </article>
  );
}
