"use client";

import { IconChevronDown } from "@/components/dashboard/icons";

/**
 * Pemilih periode laporan. Satu komponen dipakai halaman Analitik Penjualan
 * dan Kinerja Agen agar ukuran, fokus, dan labelnya sama.
 */
export default function PeriodSelect({ id, value, onChange, options, label = "Periode laporan" }) {
  return (
    <div className="relative w-full sm:w-auto">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-ag-line bg-white pl-3.5 pr-9 text-[12.5px] font-semibold text-ag-slate shadow-sm transition-colors hover:bg-ag-ivory-surface focus:outline-none focus:ring-2 focus:ring-ag-gold-base/40 sm:w-auto"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <IconChevronDown
        size={17}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ag-slate-secondary"
      />
    </div>
  );
}
