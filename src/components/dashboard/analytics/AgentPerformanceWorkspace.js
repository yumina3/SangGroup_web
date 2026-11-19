"use client";

import { useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import InfoNotice from "@/components/dashboard/InfoNotice";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useToast } from "@/components/dashboard/Toast";
import AnalyticsKpiCard from "@/components/dashboard/analytics/AnalyticsKpiCard";
import PeriodSelect from "@/components/dashboard/analytics/PeriodSelect";
import TrendChart from "@/components/dashboard/analytics/TrendChart";
import {
  IconCheckCircle,
  IconDownload,
  IconHourglass,
  IconPin,
  IconTarget,
  IconWallet,
} from "@/components/dashboard/icons";
import { ANALYTICS_PERIODS } from "@/lib/dashboard/analytics-data";
import { downloadCsv } from "@/lib/dashboard/csv";
import { formatRupiah } from "@/lib/dashboard/format";

const DOT_TONE = {
  emerald: "bg-emerald-500",
  slate: "bg-slate-400",
  gold: "bg-ag-gold-base",
  amber: "bg-amber-500",
};

/**
 * Halaman Kinerja Agen.
 *
 * Mengikuti docs/agen/agent_performance_kinerja_saya_sang_group: kartu target
 * lebar, empat indikator efisiensi, tren pengajuan vs deal, dan linimasa
 * aktivitas. Periode, grafik, dan unduhan dihitung dari data demo yang sama
 * dengan halaman Analitik Penjualan.
 */
export default function AgentPerformanceWorkspace({ datasets, agent }) {
  const toast = useToast();
  const [period, setPeriod] = useState(ANALYTICS_PERIODS[0].value);

  const data = datasets[period] ?? datasets[ANALYTICS_PERIODS[0].value];
  const target = data.target;

  const milestones = [
    0,
    Math.round(target.targetDeals / 3),
    Math.round((target.targetDeals * 2) / 3),
    target.targetDeals,
  ].filter((value, index, list) => list.indexOf(value) === index);

  function exportCsv() {
    const rows = [
      ["Rekap Kinerja Agen", agent.name],
      ["ID Agen", agent.agentCode],
      ["Periode", data.label],
      ["Kuartal", data.quarterLabel],
      [],
      ["Bagian", "Metrik / Bulan", "Nilai", "Keterangan"],
      [
        "Target",
        "Pencapaian Closing",
        `${target.achievedDeals} dari ${target.targetDeals} deal`,
        `${target.progress}% target deal`,
      ],
      [
        "Target",
        "Target Nilai Transaksi",
        formatRupiah(target.targetValue),
        `${formatRupiah(target.achievedValue)} tercapai (${target.valueProgress}%)`,
      ],
      ["Target", "Estimasi Komisi", formatRupiah(target.commission), target.note],
      ...data.kpis.map((kpi) => ["Indikator", kpi.label, kpi.value, kpi.note ?? ""]),
      ...data.trend.labels.map((label, index) => [
        "Tren",
        label,
        `${data.trend.inquiries[index]} pengajuan`,
        `${data.trend.deals[index]} deal`,
      ]),
      ...data.activities.map((activity) => [
        "Aktivitas",
        activity.date,
        activity.title,
        `${activity.location} • ${activity.statusLabel}`,
      ]),
    ];

    const created = downloadCsv(`rekap-kinerja-agen-${data.key}`, rows);
    if (created) {
      toast.push(
        `Rekap kinerja ${data.label} dibuat di browser. Tidak ada data yang dikirim ke server.`,
        "success",
      );
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Metrik Pribadi"]}
        title="Kinerja Saya"
        description="Pantau pencapaian target bulanan, efisiensi respon prospek, dan riwayat aktivitas transaksi pribadi Anda."
        meta={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ag-surface-low px-2.5 py-0.5 font-semibold text-ag-forest">
              ID: {agent.agentCode}
            </span>
            <span>{agent.name}</span>
          </span>
        }
        actions={
          <>
            <PeriodSelect
              id="performance-period"
              value={period}
              onChange={setPeriod}
              options={ANALYTICS_PERIODS}
            />
            <ActionButton
              variant="outline"
              size="md"
              onClick={exportCsv}
              aria-label="Unduh rekap laporan kinerja ke CSV"
            >
              <IconDownload size={17} className="text-ag-forest-medium" />
              Unduh Rekap Laporan
            </ActionButton>
          </>
        }
      />

      <InfoNotice title="Data kinerja masih demo internal">
        Target, indikator, tren, dan aktivitas berasal dari data contoh yang konsisten dengan halaman
        Analitik Penjualan. Unduhan dibuat di browser tanpa mengirim data ke server.
      </InfoNotice>

      <Panel bodyClassName="space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-ag-surface-low px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ag-slate">
              {target.label}
            </span>
            <span className="text-[11px] text-ag-slate-muted">{target.quarterLabel}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1 text-[10.5px] font-semibold text-red-600">
            <IconHourglass size={14} />
            {target.daysLeft}
          </span>
        </div>

        <div>
          <h2 className="text-[17px] font-bold tracking-tight text-ag-slate">
            Pencapaian Closing: {target.achievedDeals} dari {target.targetDeals} Deal (
            {target.progress}%)
          </h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ag-slate-secondary">
            {target.note}
          </p>
        </div>

        <div>
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-ag-surface-low p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ag-gold-muted via-ag-gold-base to-ag-gold-light transition-[width] duration-700"
              style={{ width: `${target.progress}%` }}
            />
          </div>

          <div className="mt-2 grid grid-cols-4 gap-1 text-[10px]">
            {milestones.map((value, index) => {
              const isTarget = index === milestones.length - 1;
              const achieved = value > 0 && value <= target.achievedDeals;
              const align =
                index === 0 ? "text-left" : isTarget ? "text-right" : "text-center";

              return (
                <div key={value} className={`flex flex-col ${align}`}>
                  <span
                    className={`font-semibold ${
                      isTarget
                        ? "text-ag-slate"
                        : achieved
                          ? "text-emerald-700"
                          : "text-ag-slate-muted"
                    }`}
                  >
                    {value} Deal
                  </span>
                  <span
                    className={`${
                      isTarget
                        ? "font-bold text-ag-gold-muted"
                        : achieved
                          ? "text-emerald-700"
                          : "text-ag-slate-muted"
                    }`}
                  >
                    {isTarget
                      ? target.achievedDeals >= target.targetDeals
                        ? "Target Tercapai"
                        : "Target 100%"
                      : value === 0
                        ? "Awal Periode"
                        : achieved
                          ? "Tercapai"
                          : "Belum Tercapai"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 rounded-lg bg-ag-ivory p-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-ag-forest shadow-sm"
            >
              <IconTarget size={18} />
            </span>
            <div>
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-ag-slate-secondary">
                Target Nilai Transaksi
              </p>
              <p className="text-[13px] font-bold text-ag-slate">
                {formatRupiah(target.targetValue)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm"
            >
              <IconCheckCircle size={18} />
            </span>
            <div>
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-ag-slate-secondary">
                Tercapai
              </p>
              <p className="text-[13px] font-bold text-ag-slate">
                {formatRupiah(target.achievedValue)}{" "}
                <span className="text-[10px] font-semibold text-emerald-700">
                  ({target.valueProgress}%)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ag-forest text-ag-gold-base shadow-sm"
            >
              <IconWallet size={18} />
            </span>
            <div>
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-ag-slate-secondary">
                Estimasi Komisi
              </p>
              <p className="text-[13px] font-bold text-ag-gold-muted">
                {formatRupiah(target.commission)}
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <AnalyticsKpiCard key={kpi.key} {...kpi} uppercaseLabel />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Tren Kinerja"
          description={`Rasio pengajuan prospek terhadap closing deal — ${data.trend.caption}.`}
          action={
            <div className="flex items-center gap-3 rounded-lg bg-ag-surface-low px-3 py-1.5">
              <span className="flex items-center gap-1.5 text-[10.5px] text-ag-slate">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ag-forest" />
                Pengajuan Masuk
              </span>
              <span className="flex items-center gap-1.5 text-[10.5px] text-ag-slate">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ag-gold-base" />
                Deal Tercapai
              </span>
            </div>
          }
        >
          <div className="pt-2 md:hidden">
            <TrendChart
              width={390}
              height={230}
              labels={data.trend.labels}
              series={[
                {
                  key: "inquiries",
                  label: "pengajuan",
                  color: "#0D3B2E",
                  areaOpacity: 0.18,
                  values: data.trend.inquiries,
                },
                {
                  key: "deals",
                  label: "deal",
                  color: "#D4AF37",
                  areaOpacity: 0.22,
                  values: data.trend.deals,
                },
              ]}
              ariaLabel={`Grafik tren kinerja: ${data.trend.labels
                .map(
                  (label, index) =>
                    `${label} ${data.trend.inquiries[index]} pengajuan dan ${data.trend.deals[index]} deal`,
                )
                .join(", ")}`}
            />
          </div>

          <div className="hidden pt-2 md:block">
            <TrendChart
              labels={data.trend.labels}
              series={[
                {
                  key: "inquiries",
                  label: "pengajuan",
                  color: "#0D3B2E",
                  areaOpacity: 0.18,
                  values: data.trend.inquiries,
                },
                {
                  key: "deals",
                  label: "deal",
                  color: "#D4AF37",
                  areaOpacity: 0.22,
                  values: data.trend.deals,
                },
              ]}
              ariaLabel={`Grafik tren kinerja: ${data.trend.labels
                .map(
                  (label, index) =>
                    `${label} ${data.trend.inquiries[index]} pengajuan dan ${data.trend.deals[index]} deal`,
                )
                .join(", ")}`}
            />
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg bg-ag-surface-low px-4 py-3">
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-ag-forest-medium">
              <IconTarget size={17} />
            </span>
            <p className="text-[11.5px] leading-relaxed text-ag-slate-secondary">
              {data.trend.insight}
            </p>
          </div>
        </Panel>

        <Panel
          className="lg:col-span-5"
          title="Aktivitas Terakhir"
          description={`Catatan tindak lanjut dan kunjungan ${data.activityWindowLabel.toLowerCase()}.`}
          action={
            <span className="text-[10.5px] font-semibold text-ag-slate-muted">
              {data.activityWindowLabel}
            </span>
          }
        >
          <ol className="relative space-y-5 border-l border-ag-line pl-5">
            {data.activities.map((activity) => (
              <li key={activity.id} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                    DOT_TONE[activity.dotTone] ?? DOT_TONE.slate
                  }`}
                />
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-ag-slate-muted">{activity.date}</span>
                    <p className="mt-0.5 text-[11.5px] font-semibold leading-snug text-ag-slate">
                      {activity.title}
                    </p>
                    <p className="mt-1 flex items-start gap-1 text-[10.5px] leading-snug text-ag-slate-secondary">
                      <IconPin size={12} className="mt-0.5 shrink-0 text-ag-forest-medium" />
                      <span>{activity.location}</span>
                    </p>
                  </div>
                  <span className="shrink-0">
                    <StatusBadge
                      label={activity.statusLabel}
                      tone={activity.statusTone}
                    />
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
