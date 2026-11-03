/**
 * Kartu angka ringkasan. Satu nilai besar, satu keterangan, satu catatan
 * kaki. `tone` hanya mengubah warna ikon, bukan aksen yang meriah.
 */
const ICON_TONE = {
  forest: "bg-[#e7f0eb] text-ag-forest",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  neutral: "bg-slate-100 text-slate-600",
};

export default function StatCard({ label, value, unit, footnote, icon, tone = "forest" }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-ag-slate-secondary">{label}</p>
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 items-center justify-center rounded-dash text-[13px] font-bold ${ICON_TONE[tone] ?? ICON_TONE.forest}`}
        >
          {icon}
        </span>
      </div>

      <p className="mb-3 flex items-baseline gap-1.5">
        <span className="text-[32px] font-extrabold leading-none text-ag-slate">{value}</span>
        {unit ? <span className="text-[13px] text-ag-slate-secondary">{unit}</span> : null}
      </p>

      <p className="border-t border-slate-100 pt-2 text-[12px] leading-snug text-ag-slate-secondary">
        {footnote}
      </p>
    </div>
  );
}
