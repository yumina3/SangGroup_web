"use client";

import { useMemo, useState } from "react";

import { useToast } from "@/components/dashboard/Toast";
import {
  IconBuilding,
  IconCheckCircle,
  IconChevronDown,
  IconDownload,
  IconHourglass,
  IconPieChart,
  IconPrinter,
  IconSearch,
  IconSliders,
  IconWallet,
} from "@/components/dashboard/icons";
import { downloadCsv } from "@/lib/dashboard/csv";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
  initialsOf,
} from "@/lib/dashboard/format";
import TablePagination from "./TablePagination";

const PAGE_SIZE = 9;

const PERIODS = [
  { value: "all", label: "Semua Waktu" },
  { value: "month", label: "Bulan Ini" },
  { value: "quarter", label: "Kuartal Ini" },
  { value: "year", label: "Tahun Ini" },
];

const SEGMENTS = [
  { key: "tersedia", label: "Tersedia", bar: "bg-ag-available", dot: "bg-ag-available" },
  { key: "dipesan", label: "Dipesan", bar: "bg-ag-booked", dot: "bg-ag-booked" },
  { key: "terjual", label: "Terjual", bar: "bg-ag-forest", dot: "bg-ag-forest" },
];

const BUSINESS_LABEL = { tersedia: "Tersedia", dipesan: "Dipesan", terjual: "Terjual" };

const BUSINESS_BADGE = {
  tersedia: "bg-ag-available/15 text-ag-available",
  dipesan: "bg-ag-booked/15 text-ag-booked",
  terjual: "bg-ag-forest/10 text-ag-forest",
};

const VERIFICATION_LABEL = {
  approved: "Terverifikasi",
  pending: "Menunggu",
  rejected: "Ditolak",
};

const VERIFICATION_BADGE = {
  approved: "bg-ag-available/15 text-ag-available",
  pending: "bg-ag-booked/15 text-ag-booked",
  rejected: "bg-red-500/10 text-red-600",
};

/**
 * Rekap properti admin (FR-42) mengikuti
 * docs/admin/property_recap_sang_group_semarang.
 *
 * Angka berasal dari database lewat `getPropertyRecap`. Filter periode memuat
 * ulang data di server; filter cluster/kategori/agen/status dan pencarian
 * bekerja dari data yang sudah diterima halaman agar respons instan.
 */
export default function PropertyRecapWorkspace({ recap, properties, period: initialPeriod }) {
  const toast = useToast();

  const [period, setPeriod] = useState(initialPeriod);
  const [cluster, setCluster] = useState("");
  const [category, setCategory] = useState("");
  const [agent, setAgent] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [page, setPage] = useState(1);

  const hasFilter =
    period !== "all" || Boolean(cluster || category || agent || status || search.trim());

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return properties.filter(
      (property) =>
        (!cluster || property.cluster === cluster) &&
        (!category || property.category === category) &&
        (!agent || property.agent === agent) &&
        (!status || property.businessStatus === status) &&
        (!term ||
          property.title.toLowerCase().includes(term) ||
          property.unit.toLowerCase().includes(term) ||
          property.cluster.toLowerCase().includes(term)),
    );
  }, [properties, cluster, category, agent, status, search]);

  const byProject = useMemo(
    () => recap.byProject.filter((row) => !cluster || row.name === cluster),
    [recap.byProject, cluster],
  );
  const byCategory = useMemo(
    () => recap.byCategory.filter((row) => !category || row.name === category),
    [recap.byCategory, category],
  );
  const byAgent = useMemo(
    () => recap.byAgent.filter((row) => !agent || row.name === agent),
    [recap.byAgent, agent],
  );

  const filteredByBusiness = useMemo(() => {
    const counts = { tersedia: 0, dipesan: 0, terjual: 0 };
    for (const property of rows) counts[property.businessStatus] += 1;
    return counts;
  }, [rows]);

  const filteredValue = rows.reduce((sum, property) => sum + property.price, 0);
  const filteredVerified = rows.filter(
    (property) => property.verificationStatus === "approved",
  ).length;

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const lastBooked = properties.find((property) => property.businessStatus === "dipesan");
  const lastSold = properties.find((property) => property.businessStatus === "terjual");
  const dominantCategory = [...byCategory].sort((a, b) => b.total - a.total)[0] ?? null;

  function applyPeriod(nextPeriod) {
    setPeriod(nextPeriod);
    const url = new URL(window.location.href);
    if (nextPeriod === "all") url.searchParams.delete("periode");
    else url.searchParams.set("periode", nextPeriod);
    window.location.assign(url.toString());
  }

  function resetFilters() {
    setCluster("");
    setCategory("");
    setAgent("");
    setStatus("");
    setSearch("");
    setPage(1);
    if (period !== "all") applyPeriod("all");
  }

  function exportCsv() {
    const header = [
      "Properti",
      "Kavling",
      "Cluster",
      "Kategori",
      "Agen",
      "Harga",
      "Ketersediaan",
      "Verifikasi",
    ];
    const body = rows.map((property) => [
      property.title,
      property.unit,
      property.cluster,
      property.category,
      property.agent,
      property.price,
      BUSINESS_LABEL[property.businessStatus] ?? property.businessStatus,
      VERIFICATION_LABEL[property.verificationStatus] ?? property.verificationStatus,
    ]);

    const created = downloadCsv("rekap-properti", [header, ...body]);
    toast.push(
      created ? `Ekspor ${rows.length} properti ke CSV dibuat.` : "Tidak ada properti untuk diekspor.",
      created ? "success" : "danger",
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-[20px] font-bold leading-7 tracking-tight text-ag-slate">
            Rekap Properti
          </h1>
          <p className="mt-0.5 text-[12px] text-ag-slate-secondary">
            Rekap properti dihitung langsung dari database geospatial
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[12px] font-semibold text-ag-slate shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors hover:bg-ag-surface-low"
          >
            <IconDownload size={18} className="text-ag-slate-secondary" />
            Ekspor CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[12px] font-semibold text-ag-slate shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors hover:bg-ag-surface-low"
          >
            <IconPrinter size={18} className="text-ag-slate-secondary" />
            Cetak
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="recap-filters"
          className="flex w-full items-center justify-between md:hidden"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary">
            Filter
          </span>
          <IconChevronDown
            size={18}
            className={`text-ag-slate-secondary transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div
          id="recap-filters"
          className={`${filtersOpen ? "flex" : "hidden"} flex-col gap-3 md:flex md:flex-row md:items-end md:justify-between`}
        >
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <FilterSelect
              id="filter-periode"
              label="Periode"
              value={period}
              options={PERIODS}
              onChange={applyPeriod}
            />
            <FilterSelect
              id="filter-cluster"
              label="Cluster"
              value={cluster}
              options={[
                { value: "", label: "Semua Cluster" },
                ...recap.options.projects.map((item) => ({ value: item.name, label: item.name })),
              ]}
              onChange={(value) => {
                setCluster(value);
                setPage(1);
              }}
            />
            <FilterSelect
              id="filter-kategori"
              label="Kategori"
              value={category}
              options={[
                { value: "", label: "Semua Kategori" },
                ...recap.options.categories.map((item) => ({ value: item.name, label: item.name })),
              ]}
              onChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
            />
            <FilterSelect
              id="filter-agen"
              label="Agen"
              value={agent}
              options={[
                { value: "", label: "Semua Agen" },
                ...recap.options.agents.map((item) => ({
                  value: item.full_name,
                  label: item.full_name,
                })),
              ]}
              onChange={(value) => {
                setAgent(value);
                setPage(1);
              }}
            />
            <FilterSelect
              id="filter-status"
              label="Status"
              value={status}
              options={[
                { value: "", label: "Semua Status" },
                ...SEGMENTS.map((segment) => ({ value: segment.key, label: segment.label })),
              ]}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilter}
              className="rounded-lg px-3 py-2 text-[12px] font-semibold text-ag-slate-secondary transition-colors hover:bg-ag-surface-low disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() =>
                toast.push(`${rows.length} properti cocok dengan filter aktif.`, "success")
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-ag-forest px-4 py-2 text-[12px] font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors hover:bg-ag-forest-medium"
            >
              <IconSliders size={16} className="text-ag-gold-base" />
              Terapkan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <RecapCard
          label="Total Properti"
          value={formatNumber(rows.length)}
          unit="unit terdaftar"
          tone="slate"
          icon={<IconBuilding size={20} />}
          footer={syncLabel(recap.geotagged, recap.totalGeotagged)}
          footerTone="text-ag-slate-secondary"
        />
        <RecapCard
          label="Tersedia"
          value={formatNumber(filteredByBusiness.tersedia)}
          unit="unit aktif"
          valueClass="text-ag-available"
          tone="available"
          icon={<IconCheckCircle size={20} />}
          footer={`${percentOf(filteredByBusiness.tersedia, rows.length)} dari total inventori`}
          footerClass="font-semibold text-ag-available"
        />
        <RecapCard
          label="Dipesan"
          value={formatNumber(filteredByBusiness.dipesan)}
          unit="unit NUP/Booking"
          valueClass="text-ag-booked"
          tone="booked"
          icon={<IconHourglass size={20} />}
          footer={lastBooked ? `${lastBooked.cluster} ${lastBooked.unit}`.trim() : "Belum ada unit dipesan"}
          footerClass="font-semibold text-ag-booked"
        />
        <RecapCard
          label="Terjual"
          value={formatNumber(filteredByBusiness.terjual)}
          unit="unit closed"
          valueClass="text-ag-forest"
          tone="forest"
          icon={<IconCheckCircle size={20} />}
          footer={lastSold ? `${lastSold.cluster} ${lastSold.unit}`.trim() : "Belum ada unit terjual"}
        />
        <RecapCard
          label="Nilai Listing"
          value={formatRupiahShort(filteredValue)}
          unit={formatRupiah(filteredValue)}
          valueClass="text-[24px] tracking-tight"
          tone="gold"
          icon={<IconWallet size={20} />}
          footer="Akumulasi harga listing terfilter"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] lg:col-span-7">
          <div>
            <div className="flex flex-col justify-between gap-3 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[16px] font-bold text-ag-slate">Properti per Cluster</h2>
                <p className="mt-0.5 text-[12px] text-ag-slate-secondary">
                  Distribusi status ketersediaan kavling tiap kawasan
                </p>
              </div>
              <ul className="flex items-center gap-3">
                {SEGMENTS.map((segment) => (
                  <li
                    key={segment.key}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-ag-slate-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block h-2.5 w-2.5 rounded-[2px] ${segment.dot}`}
                    />
                    {segment.label}
                  </li>
                ))}
              </ul>
            </div>

            {byProject.length === 0 ? (
              <EmptyNote>Belum ada cluster dengan properti pada filter ini.</EmptyNote>
            ) : (
              <ul className="mt-4 flex flex-col gap-6">
                {byProject.map((row) => (
                  <li key={row.projectId} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-ag-slate">{row.name}</span>
                      <span className="font-semibold text-ag-slate-secondary">
                        Total: {formatNumber(row.total)} Unit
                      </span>
                    </div>
                    <div className="flex h-8 w-full gap-0.5 overflow-hidden rounded-lg bg-ag-surface-low p-0.5">
                      {SEGMENTS.map((segment) => {
                        const count = row[segment.key];
                        if (count === 0) return null;
                        const share = (count / row.total) * 100;
                        return (
                          <div
                            key={segment.key}
                            style={{ width: `${share}%` }}
                            title={`${segment.label}: ${count} unit (${percentOf(count, row.total)}%)`}
                            className={`flex h-full items-center justify-center overflow-hidden rounded-md text-[11px] font-bold text-white ${segment.bar}`}
                          >
                            {share >= 18 ? (
                              <span className="truncate px-1">
                                {count} {segment.label}
                                {share === 100 ? " (100%)" : ""}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="-mx-6 -mb-6 mt-6 flex flex-wrap items-center justify-between gap-2 rounded-b-lg bg-ag-surface-low/60 px-6 py-3 text-[12px] text-ag-slate-secondary">
            <span className="flex items-center gap-1.5">
              <IconBuilding size={16} className="text-ag-forest" />
              {byProject.length} Kawasan Aktif Terdaftar
            </span>
            <span className="font-bold text-ag-slate">
              Total {formatNumber(byProject.reduce((sum, row) => sum + row.total, 0))} Unit Kavling
            </span>
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] lg:col-span-5">
          <div>
            <div className="pb-4">
              <h2 className="text-[16px] font-bold text-ag-slate">Properti per Kategori</h2>
              <p className="mt-0.5 text-[12px] text-ag-slate-secondary">
                Komposisi tipe rumah yang dikembangkan
              </p>
            </div>
            {byCategory.length === 0 ? (
              <EmptyNote>Belum ada kategori dengan properti pada filter ini.</EmptyNote>
            ) : (
              <ul className="mt-2 flex flex-col gap-4">
                {byCategory.map((row) => {
                  const share = percentOf(row.total, rows.length, 1);
                  return (
                    <li key={row.categoryId} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-ag-slate">{row.name}</span>
                        <span className="font-bold text-ag-forest">
                          {formatNumber(row.total)} Unit{" "}
                          <span className="text-[11px] font-normal text-ag-slate-muted">
                            ({share}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-ag-surface-low">
                        <div
                          className="h-full rounded-full bg-ag-forest"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="-mx-6 -mb-6 mt-6 flex flex-wrap items-center justify-between gap-2 rounded-b-lg bg-ag-surface-low/60 px-6 py-3 text-[12px] text-ag-slate-secondary">
            <span className="flex items-center gap-1.5">
              <IconPieChart size={16} className="text-ag-gold-base" />
              {dominantCategory
                ? `Dominasi ${dominantCategory.name}`
                : "Belum ada dominasi kategori"}
            </span>
            <span className="font-bold text-ag-slate">
              {byCategory.length} Kategori Produk
            </span>
          </div>
        </section>
      </div>

      <section className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="p-6">
          <h2 className="text-[16px] font-bold text-ag-slate">Rekap per Agen</h2>
          <p className="mt-0.5 text-[12px] text-ag-slate-secondary">
            Performa dan portofolio listing yang dikelola masing-masing agen aktif
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-ag-surface-low text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary">
              <tr>
                <th scope="col" className="px-6 py-3">Agen</th>
                <th scope="col" className="px-4 py-3 text-center">Total Listing</th>
                <th scope="col" className="px-4 py-3 text-center">Terverifikasi</th>
                <th scope="col" className="px-4 py-3 text-center">Tersedia</th>
                <th scope="col" className="px-4 py-3 text-center">Dipesan</th>
                <th scope="col" className="px-4 py-3 text-center">Terjual</th>
                <th scope="col" className="px-6 py-3 text-right">Nilai Listing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ag-line/70">
              {byAgent.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-ag-slate-secondary">
                    Belum ada agen dengan listing pada filter ini.
                  </td>
                </tr>
              ) : (
                byAgent.map((row, index) => (
                  <tr key={row.agentId} className="transition-colors hover:bg-ag-surface-low/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold ${
                            index % 3 === 0
                              ? "bg-ag-forest text-ag-gold-light"
                              : index % 3 === 1
                                ? "bg-ag-forest-medium text-ag-gold-base"
                                : "bg-ag-slate text-white"
                          }`}
                        >
                          {initialsOf(row.name)}
                        </span>
                        <span className="flex flex-col">
                          <span className="font-bold text-ag-slate">{row.name}</span>
                          <span className="text-[11px] text-ag-slate-secondary">
                            Agen properti
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-ag-slate">{row.total}</td>
                    <td className="px-4 py-4 text-center text-ag-slate">{row.verified}</td>
                    <td className="px-4 py-4 text-center font-bold text-ag-available">
                      {row.tersedia}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-ag-booked">{row.dipesan}</td>
                    <td
                      className={`px-4 py-4 text-center ${row.terjual > 0 ? "font-bold text-ag-forest" : "text-ag-slate-muted"}`}
                    >
                      {row.terjual}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-bold text-ag-slate">
                      {formatRupiah(row.value)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {byAgent.length > 0 ? (
              <tfoot className="bg-ag-surface-low font-bold">
                <tr>
                  <td className="px-6 py-4 tracking-wide text-ag-slate">TOTAL SISTEM</td>
                  <td className="px-4 py-4 text-center text-ag-slate">
                    {sumBy(byAgent, "total")}
                  </td>
                  <td className="px-4 py-4 text-center text-ag-slate">
                    {sumBy(byAgent, "verified")}
                  </td>
                  <td className="px-4 py-4 text-center text-ag-available">
                    {sumBy(byAgent, "tersedia")}
                  </td>
                  <td className="px-4 py-4 text-center text-ag-booked">
                    {sumBy(byAgent, "dipesan")}
                  </td>
                  <td className="px-4 py-4 text-center text-ag-forest">
                    {sumBy(byAgent, "terjual")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-ag-forest">
                    {formatRupiah(sumBy(byAgent, "value"))}
                  </td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>

      <section className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-[16px] font-bold text-ag-slate">Daftar Properti</h2>
            <p className="mt-0.5 text-[12px] text-ag-slate-secondary">
              Detail {formatNumber(rows.length)} properti aktif yang tersimpan dalam sistem
              informasi GIS
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <IconSearch
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ag-slate-secondary"
            />
            <label htmlFor="recap-search" className="sr-only">
              Cari nama properti atau kavling
            </label>
            <input
              id="recap-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama atau kavling..."
              className="w-full rounded-lg bg-ag-surface-low py-1.5 pl-9 pr-3 text-[12px] text-ag-slate placeholder:text-ag-slate-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-ag-gold-base/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-ag-surface-low text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary">
              <tr>
                <th scope="col" className="px-6 py-3">Foto</th>
                <th scope="col" className="px-4 py-3">Properti</th>
                <th scope="col" className="px-4 py-3">Cluster</th>
                <th scope="col" className="px-4 py-3">Kategori</th>
                <th scope="col" className="px-4 py-3">Agen</th>
                <th scope="col" className="px-4 py-3">Harga</th>
                <th scope="col" className="px-4 py-3">Ketersediaan</th>
                <th scope="col" className="px-6 py-3 text-right">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ag-line/70">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-ag-slate-secondary">
                    Tidak ada properti yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                pageRows.map((property) => (
                  <tr key={property.id} className="transition-colors hover:bg-ag-surface-low/40">
                    <td className="px-6 py-3">
                      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-ag-surface-low text-ag-slate-muted">
                        {property.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={property.imageUrl}
                            alt=""
                            width={48}
                            height={48}
                            loading="lazy"
                            className="h-12 w-12 object-cover"
                          />
                        ) : (
                          <IconBuilding size={20} />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-ag-slate">{property.title}</span>
                        <span className="text-[11px] font-medium text-ag-slate-secondary">
                          {property.unit || "Tanpa kode kavling"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ag-slate">{property.cluster}</td>
                    <td className="px-4 py-3 font-medium text-ag-slate-secondary">
                      {property.category}
                    </td>
                    <td className="px-4 py-3 text-ag-slate">{property.agent}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-ag-slate">
                      {formatRupiah(property.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold ${BUSINESS_BADGE[property.businessStatus] ?? "bg-ag-surface-low text-ag-slate-secondary"}`}
                      >
                        {BUSINESS_LABEL[property.businessStatus] ?? property.businessStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold ${VERIFICATION_BADGE[property.verificationStatus] ?? "bg-ag-surface-low text-ag-slate-secondary"}`}
                      >
                        {VERIFICATION_LABEL[property.verificationStatus] ??
                          property.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          total={rows.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemLabel="properti"
          prevLabel="Prev"
          nextLabel="Next"
        />
      </section>
    </div>
  );
}

const CARD_TONE = {
  slate: "bg-ag-surface-low text-ag-slate",
  available: "bg-ag-available/10 text-ag-available",
  booked: "bg-ag-booked/10 text-ag-booked",
  forest: "bg-ag-forest/10 text-ag-forest",
  gold: "bg-ag-gold-base/15 text-ag-gold-base",
};

/** Kartu KPI dengan footerdi bawah seperti desain rekap properti. */
function RecapCard({
  label,
  value,
  unit,
  footer,
  icon,
  tone = "slate",
  valueClass = "",
  footerClass = "text-ag-slate-secondary",
}) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary">
            {label}
          </p>
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${CARD_TONE[tone] ?? CARD_TONE.slate}`}
          >
            {icon}
          </span>
        </div>
        <div className="my-3">
          <p className={`text-[28px] font-bold leading-none text-ag-slate ${valueClass}`}>
            {value}
          </p>
          {unit ? (
            <p className="mt-1 text-[12px] font-medium text-ag-slate-muted">{unit}</p>
          ) : null}
        </div>
      </div>
      <p
        className={`mt-auto bg-ag-surface-low/60 px-5 py-2.5 text-[12px] leading-snug ${footerClass}`}
      >
        {footer}
      </p>
    </div>
  );
}

function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-lg bg-ag-surface-low py-1.5 pl-2.5 pr-8 text-[12px] text-ag-slate transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-ag-gold-base/40"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <IconChevronDown
          size={16}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ag-slate-secondary"
        />
      </div>
    </div>
  );
}

function EmptyNote({ children }) {
  return (
    <p className="rounded-lg border border-dashed border-ag-line px-4 py-6 text-center text-[12px] text-ag-slate-secondary">
      {children}
    </p>
  );
}

function percentOf(value, total, digits = 1) {
  if (!total) return "0";
  // Koma desimal agar sesuai format angka Indonesia ("84,6").
  return ((value / total) * 100).toFixed(digits).replace(".", ",");
}

function sumBy(rows, key) {
  return rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0);
}

/** Catatan sinkronisasi GIS untuk kartu total properti. */
function syncLabel(geotagged, totalGeotagged) {
  if (totalGeotagged === 0) return "0% tersinkronisasi GIS — belum ada koordinat";
  return `${Math.round((geotagged / totalGeotagged) * 100)}% tersinkronisasi GIS`;
}
