"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_LABEL = {
  tersedia: "Tersedia",
  dipesan: "Dipesan",
  terjual: "Terjual",
};

/** Favorit pembeli (FR-25, FR-26). */
export default function BuyerFavorites({ items }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function remove(propertyId) {
    setBusyId(propertyId);
    setError("");
    const response = await fetch(`/api/favorites?propertyId=${encodeURIComponent(propertyId)}`, {
      method: "DELETE",
    });
    setBusyId(null);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload?.error?.message ?? "Gagal menghapus favorit.");
      return;
    }
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="rounded-dash border border-dashed border-ag-line bg-white px-4 py-8 text-center text-[13px] text-ag-slate-secondary">
        Belum ada properti favorit. Simpan listing dari halaman detail properti.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
          {error}
        </p>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((favorite) => (
          <li
            key={favorite.id}
            className="flex gap-3 rounded-dash border border-ag-line bg-white p-3"
          >
            {favorite.property.primaryImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favorite.property.primaryImageUrl}
                alt={favorite.property.title}
                className="h-20 w-24 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="h-20 w-24 shrink-0 rounded-lg bg-ag-surface-low" aria-hidden="true" />
            )}

            <div className="min-w-0 flex-1">
              <Link
                href={`/properti/${favorite.property.slug}`}
                className="line-clamp-2 text-[13.5px] font-bold text-ag-slate hover:underline"
              >
                {favorite.property.title}
              </Link>
              <p className="text-[11.5px] text-ag-slate-secondary">
                {favorite.property.project?.name} · {favorite.property.businessStatus === "tersedia" ? "Tersedia" : BUSINESS_LABEL[favorite.property.businessStatus]}
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-ag-forest">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(favorite.property.price)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(favorite.property.id)}
                  disabled={busyId === favorite.property.id}
                  className="text-[11.5px] font-semibold text-red-600 hover:underline disabled:opacity-60"
                >
                  {busyId === favorite.property.id ? "Menghapus…" : "Hapus"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
