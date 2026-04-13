type ProblemCard = {
  title: string;
  description: string;
};

const PROBLEMS: ProblemCard[] = [
  {
    title: "Complex Setup",
    description:
      "Teams spend weeks stitching tools together before they can deliver any user value, delaying outcomes and burning focus.",
  },
  {
    title: "Fragile Integration",
    description:
      "Disconnected workflows break under scale, creating brittle handoffs between planning, implementation, and verification.",
  },
  {
    title: "No Verification",
    description:
      "Without strong validation loops, AI-generated changes ship with hidden regressions and lower confidence in production.",
  },
];

export function ProblemCardsSection() {
  return (
    <section className="px-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Where Teams Get Stuck</h3>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Most AI initiatives stall at operational complexity, not ambition.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((problem) => (
            <article key={problem.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-foreground">{problem.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{problem.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
