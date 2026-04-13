"use client";

import Link from "next/link";
import { useEffect } from "react";

type AdminErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminErrorPage({ error, reset }: AdminErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-destructive/30 bg-card p-8 shadow-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">Admin error</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Something failed in the admin area
      </h1>
      <p className="mt-4 text-sm text-muted-foreground sm:text-base">
        Retry this action or return to the dashboard.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Retry
        </button>
        <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
