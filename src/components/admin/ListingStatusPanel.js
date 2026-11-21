import Panel from "@/components/dashboard/Panel";

const SEGMENTS = [
  {
    key: "verified",
    label: "Terverifikasi",
    color: "bg-ag-available",
    dot: "bg-ag-available",
  },
  {
    key: "pending",
    label: "Menunggu Verifikasi",
    color: "bg-ag-booked",
    dot: "bg-ag-booked",
  },
  {
    key: "rejected",
    label: "Ditolak",
    color: "bg-red-500",
    dot: "bg-red-500",
  },
];

/**
 * Status listing lintas agen: satu batang proporsi + rincian jumlah dan
 * persentase. Angka dihitung dari props, bukan ditulis ulang sebagai teks.
 */
export default function ListingStatusPanel({ status }) {
  const total = status.total || 0;
  const percent = (value) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Panel
      title="Status Listing"
      description={`Total ${total} unit terdaftar.`}
      className="h-full"
    >
      <div
        className="mb-5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="img"
        aria-label={SEGMENTS.map(
          (segment) =>
            `${segment.label}: ${status[segment.key]} unit (${percent(status[segment.key])}%)`,
        ).join(", ")}
      >
        {total > 0
          ? SEGMENTS.map((segment) =>
              status[segment.key] > 0 ? (
                <span
                  key={segment.key}
                  className={`h-full ${segment.color}`}
                  style={{ width: `${(status[segment.key] / total) * 100}%` }}
                />
              ) : null,
            )
          : null}
      </div>

      <ul className="divide-y divide-slate-100">
        {SEGMENTS.map((segment) => (
          <li
            key={segment.key}
            className="flex items-center justify-between gap-3 py-2.5 text-[12.5px]"
          >
            <span className="flex items-center gap-2.5 text-ag-slate-secondary">
              <span
                aria-hidden="true"
                className={`inline-block h-2.5 w-2.5 rounded-[2px] ${segment.dot}`}
              />
              {segment.label}
            </span>
            <span className="whitespace-nowrap font-semibold text-ag-slate">
              {status[segment.key]} unit ({percent(status[segment.key])}%)
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
