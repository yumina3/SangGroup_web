"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { verifyPropertyAction } from "@/app/admin/actions";

const BUSINESS_LABEL = { tersedia: "Tersedia", dipesan: "Dipesan", terjual: "Terjual" };

/** Antrean verifikasi listing (FR-38, FR-39). */
export default function VerificationQueue({ items }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [rejecting, setRejecting] = useState(null);
  const [note, setNote] = useState("");

  async function decide(id, decision, reason = "") {
    setBusyId(id);
    setError("");
    const response = await verifyPropertyAction(id, decision, reason);
    setBusyId(null);

    if (!response.ok) {
      setError(response.formError ?? "Keputusan gagal disimpan.");
      return;
    }
    setRejecting(null);
    setNote("");
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="rounded-dash border border-dashed border-ag-line bg-white px-4 py-8 text-center text-[13px] text-ag-slate-secondary">
        Tidak ada listing yang menunggu verifikasi.
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

      <ul className="space-y-3">
        {items.map((property) => (
          <li key={property.id} className="rounded-dash border border-ag-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold">{property.title}</p>
                <p className="text-[12px] text-ag-slate-secondary">
                  {property.project?.name} · {property.slug} · {property.category?.name}
                </p>
                <p className="mt-1 text-[12px] text-ag-slate-muted">
                  Agen: {property.owner?.fullName} ·{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(property.price)}
                </p>
                <p className="text-[12px] text-ag-slate-muted">
                  {property.landArea} m² tanah · {property.buildingArea} m² bangunan ·{" "}
                  {property.bedrooms} KT · {property.bathrooms} KM · {property.images?.length ?? 0} foto ·{" "}
                  {BUSINESS_LABEL[property.businessStatus]}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => decide(property.id, "approved")}
                  disabled={busyId === property.id}
                  className="rounded-lg bg-ag-forest px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
                >
                  Setujui
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejecting(property.id);
                    setNote("");
                  }}
                  disabled={busyId === property.id}
                  className="rounded-lg border border-red-300 px-3 py-2 text-[12px] font-semibold text-red-700 disabled:opacity-60"
                >
                  Tolak
                </button>
              </div>
            </div>

            {rejecting === property.id ? (
              <div className="mt-3 space-y-2 border-t border-ag-line pt-3">
                <label htmlFor={`note-${property.id}`} className="block text-[12px] font-semibold">
                  Catatan penolakan (wajib, 5–500 karakter)
                </label>
                <textarea
                  id={`note-${property.id}`}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-lg border border-ag-line px-3 py-2 text-[13px]"
                  placeholder="Contoh: titik koordinat tidak sesuai dokumen."
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => decide(property.id, "rejected", note)}
                    disabled={busyId === property.id || note.trim().length < 5}
                    className="rounded-lg bg-red-600 px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
                  >
                    Kirim penolakan
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejecting(null)}
                    className="rounded-lg border border-ag-line px-3 py-2 text-[12px] font-semibold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
