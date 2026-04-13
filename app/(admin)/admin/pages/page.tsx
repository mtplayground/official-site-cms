import Link from "next/link";

import { PAGE_SLUGS } from "@/lib/page-content";
import { db } from "@/lib/db";

const PAGE_ITEMS = [
  { slug: PAGE_SLUGS.ABOUT, name: "About" },
  { slug: PAGE_SLUGS.LANDING, name: "Landing" },
] as const;

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

type PagesIndexProps = {
  searchParams?: Promise<{
    updated?: string;
    error?: string;
  }>;
};

export default async function PagesIndexPage({ searchParams }: PagesIndexProps) {
  const params = await searchParams;

  const records = await db.pageContent.findMany({
    where: {
      slug: { in: [PAGE_SLUGS.ABOUT, PAGE_SLUGS.LANDING] },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const bySlug = new Map(records.map((record) => [record.slug, record]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pages</h1>
        <p className="text-sm text-muted-foreground">Edit About and Landing page content.</p>
      </div>

      {params?.updated ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Page content updated successfully.
        </p>
      ) : null}

      {params?.error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Unable to process page request.
        </p>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Page</th>
                <th className="px-5 py-3 font-medium">Last Updated</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PAGE_ITEMS.map((item) => {
                const record = bySlug.get(item.slug);

                return (
                  <tr key={item.slug}>
                    <td className="px-5 py-4 font-medium text-foreground">{item.name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{formatDate(record?.updatedAt ?? null)}</td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/pages/${item.slug}/edit`} className="text-sm font-medium text-primary hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
