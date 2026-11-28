/**
 * Kartu ringkasan admin bergaya dokumen desain SANG Group: label kecil
 * kapital, angka besar dengan satuan, dan ikon di sisi kanan.
 */
const ICON_TONE = {
  forest: "text-ag-forest",
  available: "text-ag-available",
  gold: "text-ag-gold-muted",
  danger: "text-red-600",
  slate: "text-ag-slate-secondary",
};

export default function SummaryCard({
  label,
  value,
  unit,
  icon,
  tone = "forest",
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="min-w-0">
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-ag-slate-secondary">
          {label}
        </p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[20px] font-bold leading-tight text-ag-slate">
          <span>{value}</span>
          {unit ? (
            <span className="text-[12.5px] font-medium text-ag-slate-secondary">
              {unit}
            </span>
          ) : null}
        </p>
      </div>

      <span
        aria-hidden="true"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ag-surface-low ${
          ICON_TONE[tone] ?? ICON_TONE.forest
        }`}
      >
        {icon}
      </span>
    </div>
  );
}
