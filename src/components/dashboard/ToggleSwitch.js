"use client";

import { useId } from "react";

import { IconClose, IconPlus } from "@/components/dashboard/icons";

/**
 * Sakelar on/off (role="switch") untuk preferensi dashboard agen.
 *
 * Nilai selalu terbaca lewat teks status di sisi sakelar — warna saja tidak
 * cukup (WCAG 1.4.1).
 */
export default function ToggleSwitch({ checked, onChange, label, description, id }) {
  const generatedId = useId();
  const switchId = id ?? `switch-${generatedId}`;

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <label htmlFor={switchId} className="block text-[13.5px] font-semibold text-ag-slate">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-ag-slate-secondary">{description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-[11px] font-semibold uppercase tracking-wide text-ag-slate-muted sm:inline">
          {checked ? "Aktif" : "Mati"}
        </span>
        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange?.(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            checked ? "bg-ag-forest" : "bg-slate-300"
          }`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              checked ? "translate-x-5.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

/** Tombol pilih berkas untuk foto/avatar (bukan input teks). */
export function FilePickerButton({ inputRef, label = "Pilih berkas", accept, onChange, disabled }) {
  return (
    <label
      className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-dash border border-ag-line bg-white px-3 text-[12px] font-semibold text-ag-forest hover:bg-ag-surface-low ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <IconPlus size={16} />
      {label}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
}

/** Tombol hapus foto kecil yang menempel di pojok atas pratinjau. */
export function PhotoRemoveButton({ onClick, name }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-tag bg-slate-800/80 text-white hover:bg-red-600"
    >
      <IconClose size={14} />
      <span className="sr-only">Hapus {name}</span>
    </button>
  );
}
