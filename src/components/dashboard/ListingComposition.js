import { formatRupiah } from "@/lib/dashboard/format";

/**
 * Komposisi ketersediaan listing: satu batang proporsi + legenda nilai.
 * Proporsi dihitung dari data, bukan angka tetap (SRS-D-03).
 */
const SEGMENTS = [
  { key: "available", label: "Tersedia untuk dipasarkan", className: "bg-ag-available" },
  { key: "booked", label: "Dipesan (proses KPR / SPR)", className: "bg-ag-booked" },
  { key: "sold", label: "Terjual (akad selesai)", className: "bg-ag-sold" },
];

export default function ListingComposition({ summary }) {
  const total = summary.totalProperties;
  const counts = {
    available: summary.availableCount,
    booked: summary.bookedCount,
    sold: summary.soldCount,
  };

  return (
    <div>
      <div
        className="mb-4 flex h-4 w-full overflow-hidden rounded-full bg-slate-100"
        role="img"
        aria-label={SEGMENTS.map((segment) => `${segment.label}: ${counts[segment.key]} unit`).join(", ")}
      >
        {total > 0
          ? SEGMENTS.map((segment) =>
              counts[segment.key] > 0 ? (
                <span
                  key={segment.key}
                  className={`h-full ${segment.className}`}
                  style={{ width: `${(counts[segment.key] / total) * 100}%` }}
                />
              ) : null,
            )
          : null}
      </div>

      <ul className="space-y-2 text-[13px] text-slate-700">
        {SEGMENTS.map((segment) => (
          <li key={segment.key} className="flex items-center justify-between gap-3 py-1">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-[2px] ${segment.className}`} />
              {segment.label}
            </span>
            <span className="font-semibold text-ag-slate">{counts[segment.key]} unit</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[13px]">
        <span className="text-ag-slate-secondary">Total nilai listing aktif</span>
        <span className="text-[15px] font-bold text-ag-forest">
          {formatRupiah(summary.activeListingValue)}
        </span>
      </div>
    </div>
  );
}
