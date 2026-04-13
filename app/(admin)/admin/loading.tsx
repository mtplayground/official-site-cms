export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-7 w-56 rounded bg-muted" />
      <div className="h-4 w-80 rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
      </div>
      <div className="h-64 rounded-lg bg-muted" />
    </div>
  );
}
