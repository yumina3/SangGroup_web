/**
 * State kosong dan state galat baku (SRS-N-USE-02).
 * Selalu memberi tahu pengguna apa yang terjadi dan apa langkah berikutnya.
 */
export function EmptyState({ title, description, action, icon = "◻" }) {
  return (
    <div role="status" className="flex flex-col items-center px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-dash bg-ag-surface-low text-lg text-ag-slate-secondary"
      >
        {icon}
      </span>
      <p className="mt-3 text-[14px] font-semibold text-ag-slate">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ag-slate-secondary">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title = "Data gagal dimuat", description, action }) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-dash bg-red-50 text-lg text-red-600"
      >
        !
      </span>
      <p className="mt-3 text-[14px] font-semibold text-ag-slate">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ag-slate-secondary">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
