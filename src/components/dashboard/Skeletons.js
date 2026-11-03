/**
 * Skeleton pemuatan berbagi untuk halaman dashboard.
 * Bentuknya mengikuti konten akhir agar layout tidak melompat
 * (SRS-N-USE-02).
 */

function Bar({ className = "" }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded bg-slate-200/80 ${className}`} />;
}

export function HeaderSkeleton() {
  return (
    <div role="status" aria-label="Memuat halaman" className="space-y-2 pb-2">
      <Bar className="h-3 w-40" />
      <Bar className="h-7 w-64" />
      <Bar className="h-3 w-80 max-w-full" />
      <span className="sr-only">Memuat data…</span>
    </div>
  );
}

export function StatGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-dash border border-ag-line bg-white p-5"
          aria-hidden="true"
        >
          <Bar className="h-3 w-24" />
          <Bar className="mt-4 h-8 w-16" />
          <Bar className="mt-4 h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PanelSkeleton({ rows = 4 }) {
  return (
    <div className="rounded-dash border border-ag-line bg-white p-5" aria-hidden="true">
      <Bar className="h-4 w-48" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Bar key={index} className="h-8 w-full" />
        ))}
      </div>
    </div>
  );
}
