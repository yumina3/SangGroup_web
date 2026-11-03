import ActionButton from "@/components/dashboard/ActionButton";

/**
 * Bilah filter daftar properti.
 *
 * Memakai <form method="get"> biasa supaya filter tersimpan di URL dan tetap
 * bekerja tanpa JavaScript (SRS-F-PUB-04, SRS-N-USE-04). Mengirim form
 * mengembalikan `page` ke halaman 1 karena parameter page tidak ikut dikirim.
 */
export default function PropertyToolbar({ query }) {
  const hasFilter = Boolean(query.q || query.sale || query.listing);

  return (
    <form
      method="get"
      role="search"
      aria-label="Filter daftar properti"
      className="flex flex-col gap-3 rounded-dash border border-ag-line bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="filter-q" className="mb-1 block text-[12px] font-semibold text-ag-slate">
            Cari properti
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={query.q}
            placeholder="Nama properti, cluster, atau unit"
            className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="filter-sale" className="mb-1 block text-[12px] font-semibold text-ag-slate">
            Ketersediaan
          </label>
          <select
            id="filter-sale"
            name="sale"
            defaultValue={query.sale}
            className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] font-medium text-ag-slate focus:border-ag-gold-base focus:outline-none sm:w-48"
          >
            <option value="">Semua ketersediaan</option>
            <option value="AVAILABLE">Tersedia</option>
            <option value="BOOKED">Dipesan</option>
            <option value="SOLD">Terjual</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-listing" className="mb-1 block text-[12px] font-semibold text-ag-slate">
            Verifikasi
          </label>
          <select
            id="filter-listing"
            name="listing"
            defaultValue={query.listing}
            className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] font-medium text-ag-slate focus:border-ag-gold-base focus:outline-none sm:w-52"
          >
            <option value="">Semua verifikasi</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="PENDING">Menunggu verifikasi</option>
            <option value="REJECTED">Ditolak</option>
            <option value="DRAFT">Draft</option>
            <option value="HIDDEN">Disembunyikan</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasFilter ? (
          <ActionButton as="link" href="/dashboard/penjual/properti" variant="outline">
            Reset
          </ActionButton>
        ) : null}
        <ActionButton type="submit" variant="forest">
          Terapkan filter
        </ActionButton>
      </div>
    </form>
  );
}
