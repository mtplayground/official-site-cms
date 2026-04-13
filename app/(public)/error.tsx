"use client";

import Link from "next/link";
import { useEffect } from "react";

type PublicErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PublicErrorPage({ error, reset }: PublicErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl rounded-xl border border-destructive/30 bg-card p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          We could not load this page
        </h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Please try again. If the issue persists, return to the homepage.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
