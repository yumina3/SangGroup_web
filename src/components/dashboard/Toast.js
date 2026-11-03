"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { IconAlert, IconClose } from "./icons";

const ToastContext = createContext(null);

const TONE = {
  success: "border-ag-available/40",
  danger: "border-red-300",
  info: "border-ag-line",
};

const ICON = { success: IconCheck, danger: IconAlert, info: IconInfo };

function IconCheck() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </svg>
  );
}

/**
 * Toast ringan untuk umpan balik aksi.
 *
 * Selama modul server belum disambungkan, toast dipakai untuk memberi tahu
 * bahwa perubahan belum tersimpan — bukan pura-pura berhasil.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "info") => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => remove(id), 6000);
    },
    [remove],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => {
          const Icon = ICON[toast.tone] ?? ICON.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-2 rounded-dash border bg-white px-4 py-3 text-[13px] text-ag-slate shadow-lg ${
                TONE[toast.tone] ?? TONE.info
              }`}
            >
              <span className="mt-0.5 shrink-0 text-ag-forest">
                <Icon />
              </span>
              <span className="flex-1 leading-relaxed">{toast.message}</span>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                className="shrink-0 text-ag-slate-muted hover:text-ag-slate"
              >
                <IconClose size={16} />
                <span className="sr-only">Tutup pemberitahuan</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext) ?? { push: () => {} };
}
