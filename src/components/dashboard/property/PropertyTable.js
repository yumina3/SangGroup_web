import Link from "next/link";

import { EmptyState } from "@/components/dashboard/States";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { formatRupiah } from "@/lib/dashboard/format";
import { LISTING_STATUS, SALE_STATUS } from "@/lib/dashboard/status-labels";
import PropertyRowActions from "./PropertyRowActions";

/**
 * Tabel listing milik agen (SRS-F-SEL-02).
 *
 * Tabel bergulir di dalam kontainernya pada layar sempit (SRS-D-07). Baris
 * yang ditolak diberi latar berbeda dan alasannya ditampilkan di bawah judul
 * (FR-SEL-06).
 */
export default function PropertyTable({ items }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Tidak ada properti yang cocok"
        description="Ubah kata kunci atau filter, atau tambahkan listing baru."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <caption className="sr-only">Daftar properti milik Anda</caption>
        <thead>
          <tr className="h-11 border-b border-ag-line bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary">
            <th scope="col" className="px-4 text-left">Properti</th>
            <th scope="col" className="px-4 text-left">Lokasi</th>
            <th scope="col" className="px-4 text-left">Harga</th>
            <th scope="col" className="px-4 text-left">Ketersediaan</th>
            <th scope="col" className="px-4 text-left">Verifikasi</th>
            <th scope="col" className="px-4 text-left">Pengajuan</th>
            <th scope="col" className="px-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[13px]">
          {items.map((property) => {
            const rejected = property.listingStatus === "REJECTED";

            return (
              <tr
                key={property.id}
                className={
                  rejected
                    ? "bg-red-50/40 hover:bg-red-50/70"
                    : "hover:bg-ag-ivory-surface/70"
                }
              >
                <th scope="row" className="px-4 py-3 text-left align-middle font-normal">
                  <div className="flex items-center gap-3">
                    <PropertyThumb property={property} />
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-bold text-ag-slate">
                        <Link
                          href={`/dashboard/penjual/properti/${property.id}/ubah`}
                          className="hover:text-ag-forest hover:underline"
                        >
                          {property.title}
                        </Link>
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-ag-slate-muted">
                        {property.cluster} · Unit {property.unit}
                      </p>
                      {rejected && property.rejectionReason ? (
                        <p className="mt-1 flex items-start gap-1.5 text-[12px] font-medium text-red-600">
                          <span aria-hidden="true">—</span>
                          <span>Alasan admin: {property.rejectionReason}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </th>

                <td className="px-4 py-3 align-middle font-medium text-slate-700">
                  {property.city}
                </td>
                <td className="px-4 py-3 align-middle font-bold text-ag-slate">
                  {formatRupiah(property.price)}
                </td>
                <td className="px-4 py-3 align-middle">
                  <StatusBadge
                    label={SALE_STATUS[property.saleStatus].label}
                    tone={SALE_STATUS[property.saleStatus].tone}
                    dot
                  />
                </td>
                <td className="px-4 py-3 align-middle">
                  <StatusBadge
                    label={LISTING_STATUS[property.listingStatus].label}
                    tone={LISTING_STATUS[property.listingStatus].tone}
                  />
                </td>
                <td className="px-4 py-3 align-middle">
                  {property.activeInquiries > 0 ? (
                    <Link
                      href={`/dashboard/penjual/pengajuan?q=${encodeURIComponent(property.title)}`}
                      className="inline-flex items-center rounded-tag border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      {property.activeInquiries} aktif
                    </Link>
                  ) : (
                    <span className="text-[12px] text-ag-slate-muted">–</span>
                  )}
                </td>
                <td className="px-4 py-3 align-middle">
                  <PropertyRowActions property={property} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Foto utama listing. Bila belum ada foto di Storage, tampilkan blok netral
 * berisi singkatan tipe bangunan/tanah — bukan gambar contoh dari desain
 * (SRS-D-03).
 */
function PropertyThumb({ property }) {
  if (property.primaryPhotoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={property.primaryPhotoUrl}
        alt=""
        className="h-12 w-16 shrink-0 rounded-tag border border-ag-line object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-16 shrink-0 items-center justify-center rounded-tag border border-ag-line bg-ag-surface-low text-[11px] font-semibold text-ag-slate-secondary"
    >
      {property.buildingArea}/{property.landArea}
    </span>
  );
}
