import ListingVerifyButtons from "@/components/admin/ListingVerifyButtons";
import ActionButton from "@/components/dashboard/ActionButton";
import Panel from "@/components/dashboard/Panel";
import { EmptyState } from "@/components/dashboard/States";
import { formatDate, formatRupiah } from "@/lib/dashboard/format";

/**
 * Antrean verifikasi listing pada dashboard admin.
 *
 * Tabel penuh dipakai di layar ≥768 px; di ponsel baris berubah menjadi kartu
 * agar harga dan tombol tidak terjepit. Setiap baris bisa langsung disetujui
 * atau ditolak lewat `ListingVerifyButtons`.
 *
 * `pendingCount` berasal dari rekap database yang sudah dimuat halaman induk.
 * Bila tidak diberikan, jumlah baris yang dirender dipakai sebagai perkiraan.
 *
 * @param {{ items: Array<object>, query?: string, pendingCount?: number }} props
 */
export default function VerificationQueue({
  items,
  query,
  pendingCount = items.length,
}) {
  return (
    <Panel
      title="Antrean Verifikasi"
      description={
        query
          ? `Hasil pencarian “${query}” di antrean verifikasi.`
          : "Listing baru yang menunggu keputusan admin."
      }
      action={
        <span className="inline-flex items-center rounded-tag bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
          {pendingCount} tertunda
        </span>
      }
      bodyClassName=""
    >
      {items.length === 0 ? (
        <EmptyState
          title="Tidak ada listing yang cocok"
          description={
            query
              ? `Tidak ada properti atau agen yang cocok dengan “${query}”. Coba kata kunci lain atau hapus pencarian.`
              : "Antrean verifikasi sedang kosong."
          }
          action={
            query ? (
              <ActionButton as="link" href="/dashboard/admin" variant="outline" size="sm">
                Hapus pencarian
              </ActionButton>
            ) : null
          }
          icon="✓"
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <caption className="sr-only">
                Daftar listing yang menunggu verifikasi admin
              </caption>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Foto", "Properti", "Agen", "Masuk", "Harga", "Aksi"].map(
                    (label) => (
                      <th
                        key={label}
                        scope="col"
                        className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-ag-slate-muted"
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-ag-surface-low/40"
                  >
                    <td className="px-5 py-3">
                      <PropertyThumb item={item} />
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[12.5px] font-semibold leading-snug text-ag-slate">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ag-slate-secondary">
                        {item.location}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-ag-slate-secondary">
                      {item.agentName}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[12px] text-ag-slate">
                        {formatDate(item.submittedAt)}
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-semibold text-ag-booked">
                        {item.submittedNote}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-[12px] font-semibold text-ag-slate">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-5 py-3">
                      <ListingVerifyButtons propertyId={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-slate-100 md:hidden">
            {items.map((item) => (
              <li key={item.id} className="px-4 py-4">
                <div className="flex items-start gap-3">
                  <PropertyThumb item={item} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-snug text-ag-slate">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ag-slate-secondary">
                      {item.location} · {item.agentName}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <p className="text-[12px] font-semibold text-ag-slate">
                          {formatRupiah(item.price)}
                        </p>
                        <p className="text-[10.5px] text-ag-slate-muted">
                          {formatDate(item.submittedAt)} ·{" "}
                          <span className="font-semibold text-ag-booked">
                            {item.submittedNote}
                          </span>
                        </p>
                      </div>
                      <ListingVerifyButtons propertyId={item.id} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 text-[11.5px] text-ag-slate-secondary sm:flex-row sm:items-center sm:justify-between">
            <span>
              Menampilkan {items.length} dari {pendingCount} antrean verifikasi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-ag-available"
              />
              Data terbaru dari database
            </span>
          </div>
        </>
      )}
    </Panel>
  );
}

function PropertyThumb({ item }) {
  const [initial] = Array.from(item.title ?? "");

  return (
    <span className="relative flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-tag border border-ag-line bg-ag-surface-low text-[15px] font-bold uppercase text-ag-slate-secondary">
      <span aria-hidden={item.imageUrl ? "true" : undefined}>{initial || "—"}</span>
      {item.imageUrl ? (
        // Foto dari Supabase Storage: URL dinamis, jadi next/image tidak dipakai.
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </span>
  );
}
