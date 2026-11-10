"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  changeSaleStatusAction,
  deletePropertyAction,
  submitPropertyAction,
} from "@/app/dashboard/penjual/properti/actions";
import ActionButton from "@/components/dashboard/ActionButton";
import Modal from "@/components/dashboard/Modal";
import { useToast } from "@/components/dashboard/Toast";
import {
  allowedSaleTransitions,
  LISTING_STATUS,
  labelOf,
  SALE_STATUS,
} from "@/lib/dashboard/status-labels";
import SaleStatusMenu from "./SaleStatusMenu";

/**
 * Aksi per baris properti: Ubah, Ubah status, dan menu tambahan (kirim
 * verifikasi / hapus).
 *
 * - "Ubah status" hanya menampilkan transisi yang sah (SRS §6.8).
 * - "Kirim untuk verifikasi" tersedia untuk DRAFT, REJECTED, dan HIDDEN.
 * - "Hapus" memakai dialog konfirmasi.
 * - Penyimpanan belum aktif: setiap aksi dibuka dengan konfirmasi (bila
 *   mengubah keadaan) lalu memberi tahu bahwa perubahan belum tercatat —
 *   tidak pernah menampilkan "berhasil" palsu.
 */
export default function PropertyRowActions({ property }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [busy, setBusy] = useState(false);
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

  const canSubmit = ["DRAFT", "REJECTED", "HIDDEN"].includes(property.listingStatus);

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
        onSave={async (next) => {
          setBusy(true);
          const response = await changeSaleStatusAction(property.id, next);
          setBusy(false);
          if (!response.ok) {
            toast.push(response.formError ?? "Status gagal disimpan.", "danger");
            return;
          }
          toast.push(
            `Status "${property.title}" kini ${labelOf(SALE_STATUS, next)}.`,
            "success",
          );
          router.refresh();
        }}
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
            className="absolute right-0 z-20 mt-1 w-52 rounded-lg border border-ag-line bg-white p-1.5 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              disabled={!canSubmit}
              title={
                canSubmit
                  ? undefined
                  : `Listing berstatus ${labelOf(LISTING_STATUS, property.listingStatus)} tidak menunggu dikirim ulang`
              }
              onClick={() => {
                setMenuOpen(false);
                setSubmitOpen(true);
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
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="Kirim listing untuk verifikasi?"
        description="Admin akan memeriksa kelengkapan data, foto, dan titik koordinat."
        footer={
          <>
            <ActionButton variant="outline" size="md" onClick={() => setSubmitOpen(false)}>
              Batal
            </ActionButton>
            <ActionButton
              variant="primary"
              size="md"
              pending={busy}
              pendingLabel="Mengirim…"
              onClick={async () => {
                setBusy(true);
                const response = await submitPropertyAction(property.id);
                setBusy(false);
                setSubmitOpen(false);
                if (!response.ok) {
                  toast.push(response.formError ?? "Gagal mengirim verifikasi.", "danger");
                  return;
                }
                toast.push(`"${property.title}" dikirim untuk verifikasi admin.`, "success");
                router.refresh();
              }}
            >
              Kirim untuk verifikasi
            </ActionButton>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-ag-slate-secondary">
          Listing{" "}
          <strong className="font-semibold text-ag-slate">{property.title}</strong> ({property.unit})
          akan berstatus{" "}
          <strong className="font-semibold text-ag-slate">Menunggu Verifikasi</strong> hingga admin
          memutuskan. Selama itu data listing terkunci.
        </p>
      </Modal>

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
              pending={busy}
              pendingLabel="Menghapus…"
              onClick={async () => {
                setBusy(true);
                const response = await deletePropertyAction(property.id);
                setBusy(false);
                setDeleteOpen(false);
                if (!response.ok) {
                  toast.push(response.formError ?? "Gagal menghapus listing.", "danger");
                  return;
                }
                toast.push(`"${property.title}" dihapus.`, "success");
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
        {property.activeInquiries > 0 ? (
          <p
            role="status"
            className="mt-3 rounded-tag border border-amber-200 bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800"
          >
            Listing ini masih punya {property.activeInquiries} pengajuan aktif. Pertimbangkan
            menandainya <strong className="font-semibold">Terjual</strong> alih-alih menghapus.
          </p>
        ) : null}
      </Modal>
    </div>
  );
}

/** Transisi ketersediaan yang sah untuk baris ini (SRS §6.8). */
export function transitionsFor(property) {
  return allowedSaleTransitions(property);
}
