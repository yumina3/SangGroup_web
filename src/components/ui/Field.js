"use client";

import { useId } from "react";

/**
 * Satu field form: label, input, dan pesan galat yang terhubung lewat
 * aria-describedby supaya terbaca screen reader (PRD §12).
 */
export default function Field({
  label,
  name,
  type = "text",
  error,
  hint,
  autoComplete,
  required = false,
  placeholder,
  defaultValue,
}) {
  const generatedId = useId();
  const id = `${name}-${generatedId}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-brand-ink">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[
          "h-11 w-full rounded-md border bg-white px-3 text-sm text-brand-ink",
          "placeholder:text-muted/70",
          "transition-colors duration-150",
          error
            ? "border-danger focus:border-danger"
            : "border-line hover:border-muted/60 focus:border-brand",
        ].join(" ")}
      />

      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
