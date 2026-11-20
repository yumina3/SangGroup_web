"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cancelInquiryAction } from "@/app/akun/actions";

const STATUS_LABEL = {
  menunggu: "Menunggu",
  dihubungi: "Dihubungi",
  kunjungan_dijadwalkan: "Kunjungan dijadwalkan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  ditolak: "Ditolak",
};

const ACTIVE = ["menunggu", "dihubungi", "kunjungan_dijadwalkan"];
const TYPE_LABEL = { kunjungan: "Kunjungan", minat_beli: "Minat beli" };

/** Daftar pengajuan pembeli + pembatalan (FR-28, BR-29). */
export default function BuyerInquiries({ items }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function cancel(id) {
    setBusyId(id);
    setError("");
    const response = await cancelInquiryAction(id);
    setBusyId(null);
    if (!response.ok) {
      setError(response.formError ?? "Gagal membatalkan pengajuan.");
      return;
    }
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="rounded-dash border border-dashed border-ag-line bg-white px-4 py-8 text-center text-[13px] text-ag-slate-secondary">
        Belum ada pengajuan. Buka katalog properti lalu ajukan kunjungan atau minat beli.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700"
        >
          {error}
        </p>
      ) : null}

      <ul className="space-y-3">
        {items.map((inquiry) => (
          <li key={inquiry.id} className="rounded-dash border border-ag-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-bold">{inquiry.property.title}</p>
                <p className="text-[12px] text-ag-slate-secondary">
                  {TYPE_LABEL[inquiry.inquiryType] ?? inquiry.inquiryType} ·{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(inquiry.createdAt))}
                  {inquiry.property.project ? ` · ${inquiry.property.project.name}` : ""}
                </p>
                {inquiry.message ? (
                  <p className="mt-1 text-[12px] italic text-ag-slate-muted">“{inquiry.message}”</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-ag-surface-low px-2.5 py-1 text-[11px] font-semibold text-ag-slate-secondary">
                  {STATUS_LABEL[inquiry.status] ?? inquiry.status}
                </span>
                {ACTIVE.includes(inquiry.status) ? (
                  <button
                    type="button"
                    onClick={() => cancel(inquiry.id)}
                    disabled={busyId === inquiry.id}
                    className="rounded-lg border border-red-300 px-2.5 py-1.5 text-[11.5px] font-semibold text-red-700 disabled:opacity-60"
                  >
                    {busyId === inquiry.id ? "Membatalkan…" : "Batalkan"}
                  </button>
                ) : null}
              </div>
            </div>

            {inquiry.updates?.length > 0 ? (
              <ol className="mt-3 space-y-1 border-t border-ag-line pt-2 text-[11.5px] text-ag-slate-secondary">
                {inquiry.updates.slice(-3).map((update) => (
                  <li key={update.id}>
                    {STATUS_LABEL[update.newStatus] ?? update.newStatus}
                    {update.note ? ` — ${update.note}` : ""}
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
