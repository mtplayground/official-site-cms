import { db } from "@/lib/db";

type LandingSections = {
  shiftHeading?: string;
  shiftNarrative?: string;
};

const FALLBACK_SHIFT = {
  heading: "THE SHIFT IS HERE",
  narrative:
    "AI adoption is no longer optional for engineering teams. Organizations that operationalize autonomous workflows gain speed, reliability, and compounding delivery advantages.",
};

export async function ShiftSection() {
  const content = await db.pageContent.findUnique({
    where: { slug: "landing" },
    select: { sectionsJson: true },
  });

  const sections = (content?.sectionsJson as LandingSections | null) ?? null;
  const heading = sections?.shiftHeading?.trim() || FALLBACK_SHIFT.heading;
  const narrative = sections?.shiftNarrative?.trim() || FALLBACK_SHIFT.narrative;

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Strategic Context</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{heading}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{narrative}</p>
      </div>
    </section>
  );
}
