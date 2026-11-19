import { IconMap } from "@/components/dashboard/icons";

/**
 * Kartu status sistem pada Pusat Bantuan agen.
 *
 * Angka status masih data contoh dari `help-data.js`; kartu ini belum
 * terhubung ke layanan monitoring. Struktur dan warnanya mengikuti
 * `docs/agen/help_center_sang_group_semarang/code.html`.
 */
export default function HelpSystemStatus({ status }) {
  return (
    <section
      aria-labelledby="help-status-heading"
      className="rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconMap size={18} className="text-ag-forest" />
          <h2 id="help-status-heading" className="text-[14px] font-bold text-ag-slate">
            Status Sistem &amp; Server GIS
          </h2>
        </div>
        <span
          title="Data contoh, bukan monitoring produksi"
          className="inline-flex items-center gap-1.5 rounded-tag border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {status.label}
        </span>
      </div>

      <div className="mt-4 space-y-2 rounded-dash bg-ag-surface-low p-3">
        {status.rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-ag-slate-secondary">{row.label}</span>
            <span
              className={[
                "text-right text-[12px] font-semibold",
                row.tone === "positive" ? "text-ag-available" : "text-ag-forest",
              ].join(" ")}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-ag-slate-muted">
        <span>{status.updateNote}</span>
        <span>{status.build}</span>
      </div>
    </section>
  );
}
