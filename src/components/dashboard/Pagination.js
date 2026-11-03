import Link from "next/link";

/**
 * Pagination berbasis URL (searchParams), sehingga halaman bisa dibagikan
 * dan dibuka ulang (SRS-F-PUB-04 untuk katalog; pola sama dipakai dashboard).
 */
export default function Pagination({ page, pageCount, total, pageSize, basePath, params = {}, itemLabel = "data" }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function hrefFor(target) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== "") {
        search.set(key, String(value));
      }
    }
    if (target > 1) search.set("page", String(target));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  const linkClass = (disabled) =>
    [
      "inline-flex h-8 items-center rounded-dash border px-3 text-[12px] font-medium",
      disabled
        ? "cursor-not-allowed border-ag-line bg-slate-50 text-ag-slate-muted"
        : "border-ag-line bg-white text-ag-slate hover:bg-ag-ivory-surface",
    ].join(" ");

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex flex-col items-center justify-between gap-3 border-t border-ag-line px-5 py-3 text-[13px] text-ag-slate-secondary sm:flex-row"
    >
      <p>
        Menampilkan <span className="font-semibold text-ag-slate">{from}</span>–
        <span className="font-semibold text-ag-slate">{to}</span> dari{" "}
        <span className="font-semibold text-ag-slate">{total}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1.5">
        {isFirst ? (
          <span aria-disabled="true" className={linkClass(true)}>
            Sebelumnya
          </span>
        ) : (
          <Link href={hrefFor(page - 1)} rel="prev" className={linkClass(false)}>
            Sebelumnya
          </Link>
        )}

        <span className="px-2 text-[12px] font-semibold text-ag-slate">
          {page} / {Math.max(pageCount, 1)}
        </span>

        {isLast ? (
          <span aria-disabled="true" className={linkClass(true)}>
            Selanjutnya
          </span>
        ) : (
          <Link href={hrefFor(page + 1)} rel="next" className={linkClass(false)}>
            Selanjutnya
          </Link>
        )}
      </div>
    </nav>
  );
}
