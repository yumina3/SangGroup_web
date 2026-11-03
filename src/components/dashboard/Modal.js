"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Modal aksesibel dengan elemen <dialog> bawaan browser.
 *
 * - Escape menutup (perilaku bawaan dialog).
 * - Fokus dipindah ke elemen pertama di dalam, dan dikembalikan ke pemicu
 *   saat ditutup (SRS-N-USE-04).
 * - Tombol `footer` dirender di wadah ber-role "form" agar input di dalamnya
 *   (mis. catatan tindak lanjut) tetap bisa memakai atribut `form`.
 */
export default function Modal({ open, onClose, title, description, footer, children, labelledBy }) {
  const ref = useRef(null);
  const generatedId = useId();
  const titleId = labelledBy ?? `modal-title-${generatedId}`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={title ? titleId : undefined}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="w-[min(560px,calc(100vw-2rem))] rounded-dash border border-ag-line bg-white p-0 text-ag-slate backdrop:bg-black/40"
    >
      {open ? (
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 id={titleId} className="text-[16px] font-bold">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-[12px] text-ag-slate-secondary">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-dash text-ag-slate-secondary hover:bg-ag-surface-low"
            >
              <span aria-hidden="true">✕</span>
              <span className="sr-only">Tutup dialog</span>
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>

          {footer ? (
            <div
              role="form"
              aria-label={`Formulir ${title ?? "dialog"}`}
              className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 bg-ag-ivory-surface px-5 py-3"
            >
              {footer}
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
