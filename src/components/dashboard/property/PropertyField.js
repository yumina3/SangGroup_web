"use client";

import { useId } from "react";

/**
 * Satu field form properti: label, kontrol, dan pesan galat yang terhubung
 * lewat aria-describedby. `hint` dipakai untuk keterangan bantuan, sedangkan
 * `suffix`/`prefix` untuk satuan (m², Rp) yang bukan placeholder.
 */
export default function PropertyField({
  label,
  name,
  type = "text",
  error,
  hint,
  required = false,
  placeholder,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
  inputMode,
  autoComplete = "off",
  mono = false,
  readOnly = false,
  disabled = false,
}) {
  const generatedId = useId();
  const id = `${name}-${generatedId}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ag-slate">
        {label}
        {required ? (
          <span className="text-red-600" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>

      <div className="relative">
        {prefix ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-ag-slate-secondary"
          >
            {prefix}
          </span>
        ) : null}

        <input
          id={id}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={(event) => onChange?.(event.target.value)}
          required={required}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          inputMode={inputMode}
          autoComplete={autoComplete}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            "h-10 w-full rounded-lg border text-[13px] text-ag-slate",
            prefix ? "pl-10" : "pl-3",
            suffix ? "pr-12" : "pr-3",
            mono ? "font-mono" : "",
            readOnly || disabled
              ? "cursor-not-allowed border-ag-line bg-ag-surface-low text-ag-slate-secondary"
              : error
                ? "bg-white border-red-400 focus:border-red-500"
                : "bg-white border-ag-line hover:border-ag-slate-muted focus:border-ag-gold-base",
            "outline-none",
          ].join(" ")}
        />

        {suffix ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-ag-slate-muted"
          >
            {suffix}
          </span>
        ) : null}
      </div>

      {hint ? (
        <p id={hintId} className="text-[11.5px] text-ag-slate-secondary">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-[11.5px] font-semibold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Textarea dengan tampilan yang sama seperti PropertyField. */
export function PropertyTextarea({ label, name, value, onChange, error, hint, maxLength, rows = 4, placeholder }) {
  const generatedId = useId();
  const id = `${name}-${generatedId}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-semibold text-ag-slate">
          {label}
        </label>
        <span className="text-[11px] text-ag-slate-muted">
          {maxLength ? `${String(value ?? "").length}/${maxLength} karakter` : null}
        </span>
      </div>

      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value ?? ""}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={[
          "w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-[13px] leading-relaxed text-ag-slate outline-none",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-ag-line hover:border-ag-slate-muted focus:border-ag-gold-base",
        ].join(" ")}
      />

      {hint && !error ? (
        <p className="text-[11.5px] text-ag-slate-secondary">{hint}</p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-[11.5px] font-semibold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Select berlabel dengan tampilan yang sama. */
export function PropertySelect({ label, name, value, onChange, options, error, required = false, hint }) {
  const generatedId = useId();
  const id = `${name}-${generatedId}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ag-slate">
        {label}
        {required ? (
          <span className="text-red-600" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={[
          "h-10 w-full cursor-pointer rounded-lg border bg-white px-3 text-[13px] text-ag-slate outline-none",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-ag-line hover:border-ag-slate-muted focus:border-ag-gold-base",
        ].join(" ")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hint && !error ? <p className="text-[11.5px] text-ag-slate-secondary">{hint}</p> : null}

      {error ? (
        <p id={errorId} className="text-[11.5px] font-semibold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
