export default function PublicLoading() {
  return (
    <main className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-12 w-3/4 rounded bg-muted" />
        <div className="h-5 w-full rounded bg-muted" />
        <div className="h-5 w-5/6 rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 rounded-xl bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
