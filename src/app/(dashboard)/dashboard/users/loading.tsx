export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="mt-4 space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-10 w-full rounded bg-muted/70" />
          ))}
        </div>
      </div>
    </div>
  );
}
