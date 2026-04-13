import Link from "next/link";

import { db } from "@/lib/db";

type LandingSections = {
  ctaHeading?: string;
  ctaDescription?: string;
};

const FALLBACK_CTA = {
  heading: "Build With an Autonomous Software Team",
  description:
    "Move from experiments to production outcomes with a delivery engine designed for speed, reliability, and continuous verification.",
};

export async function CtaSection() {
  const content = await db.pageContent.findUnique({
    where: { slug: "landing" },
    select: { sectionsJson: true },
  });

  const sections = (content?.sectionsJson as LandingSections | null) ?? null;
  const heading = sections?.ctaHeading?.trim() || FALLBACK_CTA.heading;
  const description = sections?.ctaDescription?.trim() || FALLBACK_CTA.description;

  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-primary p-8 text-primary-foreground shadow-sm md:p-10">
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h3>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/90 sm:text-base">{description}</p>

        <div className="mt-6">
          <Link
            href="/about"
            className="inline-flex items-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
