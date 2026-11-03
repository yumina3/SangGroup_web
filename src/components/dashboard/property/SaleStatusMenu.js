"use client";

import { useEffect, useRef, useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import Modal from "@/components/dashboard/Modal";
import { labelOf, SALE_STATUS } from "@/lib/dashboard/status-labels";

/**
 * Menu "Ubah status" pada satu baris properti (SRS-F-SEL-07).
 *
 * Hanya transisi yang sah menurut matriks SRS §6.8 yang ditampilkan; pilihan
 * yang tidak diizinkan tidak muncul sama sekali. Memilih status membuka
 * dialog konfirmasi karena status ketersediaan memengaruhi katalog publik.
 */
export default function SaleStatusMenu({ property, options, onSave, triggerLabel = "Ubah status" }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [pending, setPending] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointer(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const disabled = options.length === 0;

  async function confirm() {
    if (!confirming) return;
    setPending(true);
    await onSave?.(confirming);
    setPending(false);
    setConfirming(null);
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={disabled || pending}
        title={
          disabled
            ? "Ketersediaan hanya bisa diubah bila listing sudah terverifikasi dan belum terjual"
            : undefined
        }
        className="inline-flex h-9 items-center rounded-dash px-2 text-[12px] font-semibold text-ag-gold hover:bg-ag-gold/10 disabled:cursor-not-allowed disabled:text-ag-slate-muted disabled:hover:bg-transparent"
      >
        {pending ? "Menyimpan…" : triggerLabel}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={`Ubah ketersediaan ${property.title}`}
          className="absolute right-0 z-20 mt-1 w-64 rounded-lg border border-ag-line bg-white p-1.5 shadow-lg"
        >
          <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ag-slate-muted">
            Sekarang: {labelOf(SALE_STATUS, property.saleStatus)}
          </p>

          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setConfirming(option);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] text-ag-slate hover:bg-ag-surface-low"
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  option === "AVAILABLE"
                    ? "bg-ag-available"
                    : option === "BOOKED"
                      ? "bg-ag-booked"
                      : "bg-ag-sold"
                }`}
              />
              Tandai {labelOf(SALE_STATUS, option).toLowerCase()}
            </button>
          ))}
        </div>
      ) : null}

      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title={`Tandai ${labelOf(SALE_STATUS, confirming ?? "AVAILABLE").toLowerCase()}?`}
        description={`${property.title} · Unit ${property.unit}`}
        footer={
          <>
            <ActionButton variant="outline" size="md" onClick={() => setConfirming(null)}>
              Batal
            </ActionButton>
            <ActionButton variant="forest" size="md" pending={pending} onClick={confirm}>
              Ya, ubah status
            </ActionButton>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-ag-slate-secondary">
          Ketersediaan berubah dari{" "}
          <strong className="font-semibold text-ag-slate">
            {labelOf(SALE_STATUS, property.saleStatus)}
          </strong>{" "}
          menjadi{" "}
          <strong className="font-semibold text-ag-slate">
            {labelOf(SALE_STATUS, confirming ?? "AVAILABLE")}
          </strong>
          . Status ini menentukan apakah kavling tampil tersedia di katalog publik.
        </p>
      </Modal>
    </div>
  );
}
