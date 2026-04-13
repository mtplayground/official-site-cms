import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-700">Official Site CMS</p>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">Next.js 15 baseline initialized</h1>
      <p className="max-w-xl text-muted-foreground">
        Tailwind CSS and shadcn/ui are configured with shared theme tokens and reusable UI primitives.
      </p>
      <Button>Baseline UI Ready</Button>
    </main>
  );
}
