import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
