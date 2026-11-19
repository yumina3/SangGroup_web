"use client";

import { useMemo, useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import InfoNotice from "@/components/dashboard/InfoNotice";
import Modal from "@/components/dashboard/Modal";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useToast } from "@/components/dashboard/Toast";
import AnalyticsKpiCard from "@/components/dashboard/analytics/AnalyticsKpiCard";
import PeriodSelect from "@/components/dashboard/analytics/PeriodSelect";
import TrendChart from "@/components/dashboard/analytics/TrendChart";
import {
  IconArrowRight,
  IconBuilding,
  IconChevronDown,
  IconDownload,
  IconSparkles,
} from "@/components/dashboard/icons";
import { ANALYTICS_PERIODS } from "@/lib/dashboard/analytics-data";
import { downloadCsv } from "@/lib/dashboard/csv";

const PAGE_SIZE = 5;

const CLUSTER_BAR = {
  forest: "bg-ag-forest",
  gold: "bg-ag-gold-muted",
  medium: "bg-ag-forest-medium",
};

/**
 * Halaman Analitik Penjualan.
 *
 * Susunan mengikuti docs/agen/sales_analytics_sang_group_semarang: KPI di
 * atas, grafik bulanan + distribusi cluster, lalu tabel properti. Filter
 * periode, ekspor CSV, pagination, dan dialog detail berjalan di browser dari
 * data demo yang sama, sehingga saat query database disambungkan komponen ini
 * tidak perlu diubah.
 */
export default function SalesAnalyticsWorkspace({ datasets }) {
  const toast = useToast();
  const [period, setPeriod] = useState(ANALYTICS_PERIODS[0].value);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const data = datasets[period] ?? datasets[ANALYTICS_PERIODS[0].value];

  const selected = useMemo(
    () => data.properties.find((property) => property.id === selectedId) ?? null,
    [data.properties, selectedId],
  );

  const pageCount = Math.max(1, Math.ceil(data.properties.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleProperties = data.properties.slice(startIndex, startIndex + PAGE_SIZE);
  const from = data.properties.length === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + PAGE_SIZE, data.properties.length);

  function changePeriod(next) {
    setPeriod(next);
    setPage(1);
    setSelectedId(null);
  }

  function exportCsv() {
    if (data.properties.length === 0) return;

    const kpi = Object.fromEntries(data.kpis.map((item) => [item.key, item.value]));
    const rows = [
      ["Laporan Analitik Penjualan", data.label],
      ["Total Pengajuan", kpi.inquiries],
      ["Deal", kpi.deals],
      ["Nilai Penjualan", kpi.value],
      ["Rata-rata Waktu Closing", `${kpi.closing} hari`],
      [],
      [
        "Properti",
        "Unit",
        "Klaster",
        "Lokasi",
        "Jumlah Pengajuan",
        "Jumlah Kunjungan",
        "Konversi (%)",
        "Status Kavling",
      ],
      ...data.properties.map((property) => [
        property.title,
        property.unit,
        property.cluster,
        property.location,
        property.inquiries,
        property.visits,
        property.conversion,
        property.statusLabel,
      ]),
    ];

    const created = downloadCsv(`analitik-penjualan-${data.key}`, rows);
    if (created) {
      toast.push(
        `CSV analitik ${data.label} dibuat di browser (${data.properties.length} properti). Tidak ada data yang dikirim ke server.`,
        "success",
      );
    }
  }

  const selectedContribution = selected
    ? Math.round((selected.inquiries / Math.max(data.clusterTotal, 1)) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", data.quarterLabel]}
        title="Analitik Penjualan"
        description="Analisis performa penjualan, volume pengajuan minat beli, dan konversi per klaster residensial."
        actions={
          <>
            <PeriodSelect
              id="sales-period"
              value={period}
              onChange={changePeriod}
              options={ANALYTICS_PERIODS}
            />
            <ActionButton
              variant="outline"
              size="md"
              onClick={exportCsv}
              disabled={data.properties.length === 0}
              aria-label="Ekspor laporan analitik penjualan ke CSV"
            >
              <IconDownload size={17} className="text-ag-gold" />
              Ekspor
            </ActionButton>
          </>
        }
      />

      <InfoNotice title="Data analitik masih demo internal">
        Ringkasan, grafik, dan tabel di halaman ini memakai satu sumber data contoh yang saling
        konsisten. Ekspor CSV dibuat di browser dan tidak mengirim data ke server.
      </InfoNotice>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <AnalyticsKpiCard key={kpi.key} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <Panel
          className="lg:col-span-8"
          title="Pengajuan per Bulan"
          description={data.monthly.caption}
          action={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ag-surface-low px-3 py-1.5 text-[11px] font-medium text-ag-slate">
              <IconSparkles size={14} className="text-ag-gold-base" />
              {data.monthly.peak}
            </span>
          }
        >
          <div className="pt-2 md:hidden">
            <TrendChart
              width={390}
              height={230}
              labels={data.monthly.labels}
              series={[
                {
                  key: "inquiries",
                  label: "pengajuan",
                  color: "#C5A059",
                  areaOpacity: 0.28,
                  values: data.monthly.values,
                },
              ]}
              ariaLabel={`Grafik pengajuan per bulan: ${data.monthly.labels
                .map((label, index) => `${label} ${data.monthly.values[index]}`)
                .join(", ")}`}
              showAllBadges={data.monthly.labels.length <= 6}
              showLastValues={data.monthly.labels.length > 6}
            />
          </div>

          <div className="hidden pt-2 md:block">
            <TrendChart
              labels={data.monthly.labels}
              series={[
                {
                  key: "inquiries",
                  label: "pengajuan",
                  color: "#C5A059",
                  areaOpacity: 0.28,
                  values: data.monthly.values,
                },
              ]}
              ariaLabel={`Grafik pengajuan per bulan: ${data.monthly.labels
                .map((label, index) => `${label} ${data.monthly.values[index]}`)
                .join(", ")}`}
              showAllBadges
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-ag-surface-low/60 px-4 py-3">
            <div className="flex items-center gap-2 text-[11.5px] font-medium text-ag-slate">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ag-gold-base" />
              {data.monthly.insight}
            </div>
            <span className="text-[11px] text-ag-slate-secondary">
              {data.monthly.conversionNote}
            </span>
          </div>
        </Panel>

        <Panel
          className="lg:col-span-4"
          title="Pengajuan per Cluster"
          description="Distribusi minat beli berdasarkan kawasan SANG Group."
          action={
            <span className="rounded-md bg-ag-surface-low px-2.5 py-1 text-[11px] font-semibold text-ag-slate">
              Total {data.clusterTotal}
            </span>
          }
        >
          <div className="space-y-5">
            {data.clusters.map((cluster) => (
              <div key={cluster.name}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[12.5px] font-bold text-ag-slate">{cluster.name}</span>
                    {cluster.best ? (
                      <span className="rounded bg-ag-surface-low px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ag-gold-muted">
                        Terlaris
                      </span>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-[12px] font-bold text-ag-slate">
                    {cluster.count} ({cluster.percent}%)
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-ag-slate-secondary">{cluster.area}</p>
                <div
                  className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-ag-surface-low"
                  role="img"
                  aria-label={`${cluster.name}: ${cluster.count} pengajuan, ${cluster.percent} persen`}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${
                      CLUSTER_BAR[cluster.tone] ?? CLUSTER_BAR.forest
                    }`}
                    style={{ width: `${cluster.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-ag-surface-low/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-ag-slate-secondary">Status Konsolidasi</span>
              <span className="text-[11px] font-bold text-ag-slate">
                {data.clusterTotal} Pengajuan Aktif
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-ag-slate-muted">
              {data.consolidationNote}
            </p>
          </div>
        </Panel>
      </div>

      <Panel
        title="Properti dengan Pengajuan Terbanyak"
        description={`Peringkat properti berdasarkan atensi pembeli pada ${data.label}.`}
        action={
          <span className="text-[11px] text-ag-slate-secondary">
            Diperbarui: {data.updatedLabel}
          </span>
        }
        bodyClassName="p-0"
      >
        <p className="border-b border-slate-100 px-5 py-2 text-[10.5px] text-ag-slate-muted md:hidden">
          Geser tabel ke samping untuk melihat pengajuan, kunjungan, dan status kavling.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">
              Peringkat properti berdasarkan jumlah pengajuan, kunjungan, dan konversi pada periode
              yang dipilih.
            </caption>
            <thead>
              <tr className="bg-ag-surface-low/60 text-[9.5px] font-bold uppercase tracking-wider text-ag-slate-secondary">
                <th scope="col" className="px-5 py-3.5">Properti</th>
                <th scope="col" className="px-4 py-3.5">Klaster</th>
                <th scope="col" className="px-4 py-3.5 text-center">Pengajuan</th>
                <th scope="col" className="px-4 py-3.5 text-center">Kunjungan</th>
                <th scope="col" className="px-4 py-3.5 text-center">Konversi</th>
                <th scope="col" className="px-4 py-3.5 text-center">Status Kavling</th>
                <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visibleProperties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-slate-100 transition-colors last:border-0 hover:bg-ag-surface-low/40"
                >
                  <th scope="row" className="px-5 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ag-forest text-ag-gold-light shadow-sm"
                      >
                        <IconBuilding size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-bold text-ag-slate">
                          {property.title}
                        </span>
                        <span className="block text-[10.5px] text-ag-slate-secondary">
                          {property.unit} • {property.area}
                        </span>
                      </span>
                    </div>
                  </th>
                  <td className="px-4 py-4">
                    <span className="block text-[12px] font-semibold text-ag-slate">
                      {property.cluster}
                    </span>
                    <span className="block text-[10.5px] text-ag-slate-secondary">
                      {property.location}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-[13px] font-bold text-ag-slate">
                    {property.inquiries}
                  </td>
                  <td className="px-4 py-4 text-center text-[12px] text-ag-slate-secondary">
                    {property.visits}
                  </td>
                  <td className="px-4 py-4">
                    <div className="mx-auto w-20">
                      <span className="block text-center text-[11.5px] font-semibold text-ag-slate">
                        {property.conversion}%
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-ag-surface-low"
                      >
                        <span
                          className="block h-full rounded-full bg-ag-gold-base"
                          style={{ width: `${Math.min(property.conversion, 100)}%` }}
                        />
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge label={property.statusLabel} tone={property.statusTone} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedId(property.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-ag-forest transition-colors hover:bg-ag-surface-low"
                    >
                      Detail
                      <IconArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
          <span className="text-[11px] text-ag-slate-secondary">
            Menampilkan {from}–{to} dari {data.properties.length} properti
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage <= 1}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-ag-line px-2.5 text-[11px] font-semibold text-ag-slate transition-colors hover:bg-ag-surface-low disabled:cursor-not-allowed disabled:opacity-45"
            >
              <IconChevronDown size={14} className="rotate-90" />
              Sebelumnya
            </button>
            <span className="text-[11px] font-semibold text-ag-slate">
              {safePage} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={safePage >= pageCount}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-ag-line px-2.5 text-[11px] font-semibold text-ag-slate transition-colors hover:bg-ag-surface-low disabled:cursor-not-allowed disabled:opacity-45"
            >
              Berikutnya
              <IconChevronDown size={14} className="-rotate-90" />
            </button>
          </div>
        </div>
      </Panel>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected?.title}
        description={selected ? `${selected.unit} • ${selected.cluster} • ${selected.location}` : undefined}
        footer={
          <ActionButton variant="outline" size="md" onClick={() => setSelectedId(null)}>
            Tutup
          </ActionButton>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-ag-ivory p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ag-slate-muted">
                Ringkasan {data.label}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-[11px] text-ag-slate-secondary">Jumlah Pengajuan</dt>
                  <dd className="text-[20px] font-bold text-ag-slate">{selected.inquiries}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-ag-slate-secondary">Jumlah Kunjungan</dt>
                  <dd className="text-[20px] font-bold text-ag-slate">{selected.visits}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-ag-slate-secondary">Konversi Kunjungan</dt>
                  <dd className="text-[20px] font-bold text-ag-slate">{selected.conversion}%</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-ag-slate-secondary">Status Kavling</dt>
                  <dd className="mt-1">
                    <StatusBadge label={selected.statusLabel} tone={selected.statusTone} />
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[12.5px] font-bold text-ag-slate">
                  Kontribusi terhadap total pengajuan
                </h3>
                <span className="text-[12px] font-bold text-ag-gold-muted">
                  {selectedContribution}%
                </span>
              </div>
              <div
                className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ag-surface-low"
                role="img"
                aria-label={`${selected.title} menyumbang ${selectedContribution} persen dari total pengajuan`}
              >
                <div
                  className="h-full rounded-full bg-ag-gold-base"
                  style={{ width: `${Math.min(selectedContribution, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ag-slate-secondary">
                {selected.title} mencatat {selected.inquiries} pengajuan dan {selected.visits}{" "}
                kunjungan pada {data.label}.
              </p>
            </div>

            <p className="rounded-lg border border-ag-line bg-ag-surface-low/60 px-3 py-2 text-[11px] leading-relaxed text-ag-slate-secondary">
              Angka ini berasal dari data demo. Saat database tersambung, detail akan dihitung dari
              pengajuan dan jadwal kunjungan properti yang sama.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
