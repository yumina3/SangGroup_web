"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import ActionButton from "@/components/dashboard/ActionButton";
import Modal from "@/components/dashboard/Modal";
import { useToast } from "@/components/dashboard/Toast";
import { SALE_STATUS, labelOf } from "@/lib/dashboard/status-labels";
import SaleStatusMenu from "./SaleStatusMenu";

/**
 * Aksi per baris properti: Ubah, Ubah status, dan menu tambahan (Hapus).
 *
 * - "Ubah status" hanya menampilkan transisi yang sah (SRS §6.8).
 * - "Hapus" memakai dialog konfirmasi. Selama modul server belum tersambung,
 *   aksi hanya memberi tahu bahwa penyimpanan belum aktif — tidak menampilkan
 *   "berhasil" palsu.
 */
export default function PropertyRowActions({ property }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const containerRef = useRef(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointer(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <div className="flex items-center justify-end gap-1">
      <ActionButton
        as="link"
        href={`/dashboard/penjual/properti/${property.id}/ubah`}
        variant="ghost"
        size="sm"
        className="px-2"
      >
        Ubah
      </ActionButton>

      <SaleStatusMenu
        property={property}
        options={transitionsFor(property)}
        triggerLabel="Ubah status"
        onSave={(next) =>
          toast.push(
            `Status ketersediaan "${property.title}" akan diubah menjadi ${labelOf(SALE_STATUS, next)}.`,
            "info",
          )
        }
      />

      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex h-9 w-8 items-center justify-center rounded-dash text-ag-slate-muted hover:bg-ag-surface-low hover:text-ag-slate"
        >
          <span aria-hidden="true">⋯</span>
          <span className="sr-only">Aksi lain untuk {property.title}</span>
        </button>

        {menuOpen ? (
          <div
            role="menu"
            aria-label={`Aksi lain ${property.title}`}
            className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-ag-line bg-white p-1.5 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              disabled={!["DRAFT", "REJECTED"].includes(property.listingStatus)}
              onClick={() => {
                setMenuOpen(false);
                toast.push(
                  "Pengiriman ulang untuk verifikasi belum aktif karena modul database belum tersambung.",
                  "info",
                );
              }}
              className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-[13px] text-ag-slate hover:bg-ag-surface-low disabled:cursor-not-allowed disabled:text-ag-slate-muted disabled:hover:bg-transparent"
            >
              Kirim untuk verifikasi
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
              className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
            >
              Hapus listing
            </button>
          </div>
        ) : null}
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Hapus listing properti?"
        description="Tindakan ini memerlukan konfirmasi dan tidak bisa dibatalkan."
        footer={
          <>
            <ActionButton variant="outline" size="md" onClick={() => setDeleteOpen(false)}>
              Batal
            </ActionButton>
            <ActionButton
              variant="danger"
              size="md"
              onClick={() => {
                setDeleteOpen(false);
                toast.push(
                  `Permintaan hapus untuk "${property.title}" diterima. Penyimpanan belum aktif karena modul database belum tersambung.`,
                  "info",
                );
                router.refresh();
              }}
            >
              Hapus listing
            </ActionButton>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-ag-slate-secondary">
          Listing{" "}
          <strong className="font-semibold text-ag-slate">{property.title}</strong> (
          {property.unit}) akan dihapus dari daftar Anda. Riwayat pengajuan terkait
          tetap tersimpan di sistem.
        </p>
      </Modal>
    </div>
  );
}

/** Transisi ketersediaan yang sah untuk baris ini (SRS §6.8). */
export function transitionsFor(property) {
  if (property.listingStatus !== "VERIFIED") return [];
  if (property.saleStatus === "AVAILABLE") return ["BOOKED", "SOLD"];
  if (property.saleStatus === "BOOKED") return ["SOLD", "AVAILABLE"];
  return [];
}
