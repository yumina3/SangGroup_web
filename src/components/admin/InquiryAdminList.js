"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateInquiryStatusAction } from "@/app/admin/actions";

const NEXT_STATUS = {
  menunggu: ["dihubungi", "kunjungan_dijadwalkan", "ditolak"],
  dihubungi: ["kunjungan_dijadwalkan", "selesai", "ditolak"],
  kunjungan_dijadwalkan: ["selesai", "ditolak"],
  selesai: [],
  dibatalkan: [],
  ditolak: [],
};

const STATUS_LABEL = {
  menunggu: "Menunggu",
  dihubungi: "Dihubungi",
  kunjungan_dijadwalkan: "Kunjungan dijadwalkan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  ditolak: "Ditolak",
};

/** Tabel pengajuan admin + tindak lanjut status (FR-42). */
export default function InquiryAdminList({ items }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function apply(inquiry, status) {
    const note = window.prompt(
      `Catatan untuk status "${STATUS_LABEL[status]}" (opsional, maks 500 karakter):`,
      "",
    );
    if (note === null) return;

    setBusyId(inquiry.id);
    setError("");
    const response = await updateInquiryStatusAction(inquiry.id, {
      status,
      note: note.trim() || undefined,
    });
    setBusyId(null);

    if (!response.ok) {
      setError(response.formError ?? "Gagal mengubah status.");
      return;
    }
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="rounded-dash border border-dashed border-ag-line bg-white px-4 py-10 text-center text-[13px] text-ag-slate-secondary">
        Tidak ada pengajuan pada filter ini.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-dash border border-ag-line bg-white">
        <table className="w-full min-w-[920px] text-left text-[12.5px]">
          <thead className="border-b border-ag-line bg-ag-surface-low text-[11px] uppercase tracking-wider text-ag-slate-muted">
            <tr>
              <th className="px-4 py-2.5">Pembeli</th>
              <th className="px-4 py-2.5">Properti</th>
              <th className="px-4 py-2.5">Jenis</th>
              <th className="px-4 py-2.5">Pesan</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Tindak lanjut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ag-line">
            {items.map((inquiry) => {
              const options = NEXT_STATUS[inquiry.status] ?? [];
              return (
                <tr key={inquiry.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{inquiry.buyer.fullName}</p>
                    <p className="text-[11.5px] text-ag-slate-muted">
                      {inquiry.buyer.phone ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{inquiry.property.title}</p>
                    <p className="text-[11.5px] text-ag-slate-muted">
                      {inquiry.property.project?.name} · {inquiry.property.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {inquiry.inquiryType === "kunjungan" ? "Kunjungan" : "Minat beli"}
                  </td>
                  <td className="max-w-[260px] px-4 py-3 text-ag-slate-secondary">
                    <span className="line-clamp-3">{inquiry.message || "—"}</span>
                  </td>
                  <td className="px-4 py-3">{STATUS_LABEL[inquiry.status] ?? inquiry.status}</td>
                  <td className="px-4 py-3">
                    {options.length === 0 ? (
                      <span className="text-[11.5px] text-ag-slate-muted">Final</span>
                    ) : (
                      <select
                        defaultValue=""
                        disabled={busyId === inquiry.id}
                        onChange={(event) => {
                          const value = event.target.value;
                          event.target.value = "";
                          if (value) apply(inquiry, value);
                        }}
                        className="h-8 rounded-lg border border-ag-line px-2 text-[11.5px]"
                      >
                        <option value="">Pilih status…</option>
                        {options.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABEL[status]}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
