"use client";

/**
 * Pagination sisi klien untuk tabel admin yang datanya sudah dimuat penuh.
 * Menampilkan nomor halaman di sekitar halaman aktif agar tetap ringkas saat
 * jumlah halaman banyak.
 */
export default function TablePagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  itemLabel = "data",
  prevLabel = "Sebelumnya",
  nextLabel = "Selanjutnya",
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = pageWindow(page, pageCount);

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex flex-col items-center justify-between gap-3 border-t border-ag-line bg-white px-4 py-3 text-[12.5px] text-ag-slate-secondary sm:flex-row sm:px-6"
    >
      <p>
        Menampilkan{" "}
        <span className="font-semibold text-ag-slate">{from}</span>–
        <span className="font-semibold text-ag-slate">{to}</span> dari{" "}
        <span className="font-semibold text-ag-slate">{total}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg bg-ag-surface-low px-3 py-1.5 text-[12px] font-medium text-ag-slate-secondary transition-colors hover:bg-ag-surface-low/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {prevLabel}
        </button>

        {pages.map((item, index) =>
          item === "…" ? (
            <span key={`gap-${index}`} className="px-1 text-ag-slate-muted">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={[
                "min-w-8 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                item === page
                  ? "bg-ag-forest text-white"
                  : "bg-ag-surface-low text-ag-slate hover:bg-ag-line/60",
              ].join(" ")}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="rounded-lg bg-ag-surface-low px-3 py-1.5 text-[12px] font-medium text-ag-slate-secondary transition-colors hover:bg-ag-surface-low/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {nextLabel}
        </button>
      </div>
    </nav>
  );
}

/** Nomor halaman yang ditampilkan: maksimal 5 angka + penanda celah. */
function pageWindow(page, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  const pages = [1];

  if (start > 2) pages.push("…");
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < pageCount - 1) pages.push("…");
  pages.push(pageCount);

  return pages;
}
