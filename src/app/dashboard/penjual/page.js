import { Suspense } from "react";
import { connection } from "next/server";

import ActionButton from "@/components/dashboard/ActionButton";
import ListingComposition from "@/components/dashboard/ListingComposition";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import RecentInquiriesTable from "@/components/dashboard/RecentInquiriesTable";
import RejectionNotice from "@/components/dashboard/RejectionNotice";
import { EmptyState } from "@/components/dashboard/States";
import StatGrid from "@/components/dashboard/StatGrid";
import { HeaderSkeleton, PanelSkeleton, StatGridSkeleton } from "@/components/dashboard/Skeletons";
import UpcomingVisitCard from "@/components/dashboard/UpcomingVisitCard";
import { getAgentDashboard } from "@/lib/dashboard/agent-data";
import { latestRejected, recentInquiries, summarize } from "@/lib/dashboard/agent-metrics";
import { formatLongDate } from "@/lib/dashboard/format";

export const metadata = { title: "Ringkasan Agen" };

/**
 * Ringkasan dashboard penjual/agen (SRS-F-SEL-01).
 *
 * Isi halaman bergantung pada waktu sekarang (jadwal kunjungan mendatang),
 * jadi dirender di request time lewat `connection()` lalu dialirkan di dalam
 * <Suspense>. Shell dashboard tetap prerender dengan cepat.
 *
 * Saat modul Prisma disambungkan, `getAgentDashboard()` di dalam
 * `OverviewContent` diganti query Prisma untuk pengguna yang sedang sesi.
 */
export default function AgentOverviewPage() {
  return (
    <div className="space-y-5">
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewContent />
      </Suspense>
    </div>
  );
}

async function OverviewContent() {
  await connection();

  const now = new Date();
  const { agent, properties, inquiries } = getAgentDashboard();
  const summary = summarize(properties, inquiries, now);
  const rejected = latestRejected(properties);
  const recent = recentInquiries(inquiries, 5);
  const nextVisit = summary.upcomingVisits[0] ?? null;

  const visitLabel =
    summary.upcomingVisits.length > 0
      ? `${summary.upcomingVisits.length} jadwal kunjungan mendatang.`
      : "Belum ada jadwal kunjungan mendatang.";

  return (
    <>
      <PageHeader
        eyebrow={["Portal Agen", formatLongDate(now)]}
        title={`Halo, ${agent.name}`}
        description="Ringkasan listing, pengajuan masuk, dan jadwal survei dari calon pembeli."
        actions={
          <>
            <ActionButton as="link" href="/dashboard/penjual/properti" variant="outline">
              Kelola Listing
            </ActionButton>
            <ActionButton as="link" href="/dashboard/penjual/properti/baru" variant="primary">
              + Tambah Listing Baru
            </ActionButton>
          </>
        }
      />

      <RejectionNotice property={rejected} />

      <StatGrid summary={summary} upcomingVisitLabel={visitLabel} />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          title="Pengajuan Masuk Terbaru"
          description="Permintaan kunjungan dan minat beli dari calon pembeli."
          bodyClassName=""
          action={
            <ActionButton as="link" href="/dashboard/penjual/pengajuan" variant="ghost" size="sm">
              Lihat semua
            </ActionButton>
          }
        >
          {recent.length > 0 ? (
            <>
              <RecentInquiriesTable inquiries={recent} />
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[13px] text-ag-slate-secondary">
                <span>
                  Menampilkan {recent.length} dari {inquiries.length} pengajuan
                </span>
                <ActionButton as="link" href="/dashboard/penjual/pengajuan" variant="ghost" size="sm">
                  Buka pengajuan
                </ActionButton>
              </div>
            </>
          ) : (
            <EmptyState
              title="Belum ada pengajuan"
              description="Pengajuan kunjungan dan minat beli akan muncul di sini setelah listing Anda terverifikasi dan tayang di katalog."
            />
          )}
        </Panel>

        <div className="flex flex-col gap-5 xl:col-span-4">
          <Panel title="Komposisi Listing" description="Perbandingan status ketersediaan seluruh listing.">
            <ListingComposition summary={summary} />
          </Panel>

          <UpcomingVisitCard visit={nextVisit} />
        </div>
      </div>
    </>
  );
}

function OverviewSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <div className="space-y-5">
        <StatGridSkeleton />
        <PanelSkeleton rows={5} />
      </div>
    </>
  );
}
