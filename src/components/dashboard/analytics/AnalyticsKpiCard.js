import {
  IconChart,
  IconCheckCircle,
  IconClock,
  IconInbox,
  IconPin,
  IconTarget,
  IconTrendDown,
  IconTrendUp,
  IconWallet,
} from "@/components/dashboard/icons";

const ICONS = {
  chart: IconChart,
  checkCircle: IconCheckCircle,
  clock: IconClock,
  inbox: IconInbox,
  pin: IconPin,
  target: IconTarget,
  trendDown: IconTrendDown,
  trendUp: IconTrendUp,
  wallet: IconWallet,
};

const ICON_TONE = {
  checkCircle: "bg-ag-gold/10 text-ag-gold-muted",
  wallet: "bg-emerald-50 text-emerald-700",
  clock: "bg-ag-surface-low text-ag-slate-secondary",
  pin: "bg-ag-surface-low text-ag-forest-medium",
};

const NOTE_TONE = {
  positive: "text-emerald-700",
  gold: "text-ag-gold-muted",
  info: "text-ag-forest-medium",
  neutral: "text-ag-slate-secondary",
};

/**
 * Kartu KPI analitik. Dipakai kedua halaman agar angka besar, satuan, dan
 * catatan tren selalu berada pada ritme visual yang sama.
 */
export default function AnalyticsKpiCard({
  label,
  value,
  unit,
  caption,
  note,
  noteTone = "neutral",
  noteIcon,
  icon = "chart",
  uppercaseLabel = false,
}) {
  const Icon = ICONS[icon] ?? IconChart;
  const NoteIcon = ICONS[noteIcon] ?? null;

  return (
    <div className="flex h-full flex-col justify-between rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-[12px] font-medium text-ag-slate-secondary ${
            uppercaseLabel ? "uppercase tracking-wider" : ""
          }`}
        >
          {label}
        </p>
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            ICON_TONE[icon] ?? "bg-ag-surface-low text-ag-forest"
          }`}
        >
          <Icon size={19} />
        </span>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[26px] font-bold leading-none tracking-tight text-ag-slate">
            {value}
          </span>
          {unit ? <span className="text-[12px] text-ag-slate-secondary">{unit}</span> : null}
        </div>

        {caption ? <p className="mt-1 text-[12px] text-ag-slate-secondary">{caption}</p> : null}

        {note ? (
          <div
            className={`mt-2 flex items-start gap-1.5 text-[11.5px] font-medium leading-relaxed ${
              NOTE_TONE[noteTone] ?? NOTE_TONE.neutral
            }`}
          >
            {NoteIcon ? (
              <span aria-hidden="true" className="mt-0.5 shrink-0">
                <NoteIcon size={15} />
              </span>
            ) : null}
            <span>{note}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
