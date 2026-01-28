export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-48 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((key) => (
          <div key={key} className="space-y-3 rounded-lg border bg-card p-6 shadow-sm">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="h-8 w-20 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="mt-4 h-48 w-full rounded bg-muted" />
      </div>
    </div>
  );
}
