"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

import type { EditablePageSlug } from "@/lib/page-content";
import { PAGE_SLUGS } from "@/lib/page-content";

import { Button } from "@/components/ui/button";

type LandingSections = {
  heroTagline?: string;
  heroHeadline?: string;
  heroDescription?: string;
  stats?: Array<{ value?: string; label?: string }>;
  ctaHeading?: string;
  ctaDescription?: string;
};

type PageContentFormProps = {
  slug: EditablePageSlug;
  action: (formData: FormData) => void;
  initialValues?: {
    title?: string | null;
    bodyMarkdown?: string | null;
    sections?: LandingSections | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Content"}
    </Button>
  );
}

export function PageContentForm({ slug, action, initialValues }: PageContentFormProps) {
  const sections = initialValues?.sections;

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initialValues?.title ?? ""}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={slug === PAGE_SLUGS.ABOUT ? "About" : "Landing"}
        />
      </div>

      {slug === PAGE_SLUGS.ABOUT ? (
        <div className="space-y-2">
          <label htmlFor="bodyMarkdown" className="text-sm font-medium text-foreground">
            About Markdown Content
          </label>
          <textarea
            id="bodyMarkdown"
            name="bodyMarkdown"
            rows={16}
            defaultValue={initialValues?.bodyMarkdown ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="# About\n\nWrite the About page content in Markdown."
          />
        </div>
      ) : (
        <div className="space-y-6">
          <section className="space-y-3 rounded-md border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Hero Section</h2>
            <div className="space-y-2">
              <label htmlFor="heroTagline" className="text-sm font-medium text-foreground">
                Tagline
              </label>
              <input
                id="heroTagline"
                name="heroTagline"
                type="text"
                defaultValue={sections?.heroTagline ?? ""}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="heroHeadline" className="text-sm font-medium text-foreground">
                Headline
              </label>
              <input
                id="heroHeadline"
                name="heroHeadline"
                type="text"
                defaultValue={sections?.heroHeadline ?? ""}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="heroDescription" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="heroDescription"
                name="heroDescription"
                rows={4}
                defaultValue={sections?.heroDescription ?? ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </section>

          <section className="space-y-3 rounded-md border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Stats</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
                  <label className="text-xs font-medium text-muted-foreground">Stat {index + 1} Value</label>
                  <input
                    name={`stat${index + 1}Value`}
                    type="text"
                    defaultValue={sections?.stats?.[index]?.value ?? ""}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  />
                  <label className="text-xs font-medium text-muted-foreground">Stat {index + 1} Label</label>
                  <input
                    name={`stat${index + 1}Label`}
                    type="text"
                    defaultValue={sections?.stats?.[index]?.label ?? ""}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 rounded-md border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">CTA Section</h2>
            <div className="space-y-2">
              <label htmlFor="ctaHeading" className="text-sm font-medium text-foreground">
                CTA Heading
              </label>
              <input
                id="ctaHeading"
                name="ctaHeading"
                type="text"
                defaultValue={sections?.ctaHeading ?? ""}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="ctaDescription" className="text-sm font-medium text-foreground">
                CTA Description
              </label>
              <textarea
                id="ctaDescription"
                name="ctaDescription"
                rows={3}
                defaultValue={sections?.ctaDescription ?? ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </section>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
