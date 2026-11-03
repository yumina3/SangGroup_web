const TONE = {
  success: "border-ag-available/30 bg-ag-available/10 text-emerald-700",
  warning: "border-ag-booked/30 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  gold: "border-ag-gold/40 bg-ag-gold/10 text-[#8a6a22]",
  neutral: "border-ag-line bg-slate-100 text-slate-700",
};

const DOT = {
  success: "bg-ag-available",
  warning: "bg-ag-booked",
  danger: "bg-red-500",
  info: "bg-blue-500",
  gold: "bg-ag-gold",
  neutral: "bg-slate-400",
};

/**
 * Badge status. Selalu memuat teks, dan titik warna hanya pelengkap, supaya
 * status tetap terbaca tanpa membedakan warna (WCAG 1.4.1).
 */
export default function StatusBadge({ label, tone = "neutral", dot = false }) {
  const style = TONE[tone] ?? TONE.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-tag border px-2.5 py-1 text-[11px] font-semibold ${style}`}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={`inline-block h-2 w-2 rounded-full ${DOT[tone] ?? DOT.neutral}`}
        />
      ) : null}
      {label}
    </span>
  );
}
