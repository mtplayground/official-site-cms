import { notFound } from "next/navigation";

import { updatePageContentAction } from "@/actions/pages";
import { PAGE_SLUGS } from "@/lib/page-content";
import { PageContentForm } from "@/components/admin/page-content-form";
import { db } from "@/lib/db";

type LandingSections = {
  heroTagline?: string;
  heroHeadline?: string;
  heroDescription?: string;
  stats?: Array<{ value?: string; label?: string }>;
  ctaHeading?: string;
  ctaDescription?: string;
};

type PageEditProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function PageEditPage({ params, searchParams }: PageEditProps) {
  const { slug } = await params;
  const query = await searchParams;

  if (slug !== PAGE_SLUGS.ABOUT && slug !== PAGE_SLUGS.LANDING) {
    notFound();
  }

  const content = await db.pageContent.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      bodyMarkdown: true,
      sectionsJson: true,
    },
  });

  const landingSections =
    slug === PAGE_SLUGS.LANDING && content?.sectionsJson && typeof content.sectionsJson === "object"
      ? (content.sectionsJson as LandingSections)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Edit {slug === PAGE_SLUGS.ABOUT ? "About" : "Landing"} Page
        </h1>
        <p className="text-sm text-muted-foreground">Update CMS content for this page.</p>
      </div>

      {query?.error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Unable to save page content.
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <PageContentForm
          slug={slug}
          action={updatePageContentAction.bind(null, slug)}
          initialValues={{
            title: content?.title,
            bodyMarkdown: content?.bodyMarkdown,
            sections: landingSections,
          }}
        />
      </section>
    </div>
  );
}
