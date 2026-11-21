import { Suspense } from "react";
import { connection } from "next/server";

import ListingStatusPanel from "@/components/admin/ListingStatusPanel";
import RecentActivity from "@/components/admin/RecentActivity";
import VerificationQueue from "@/components/admin/VerificationQueue";
import ActionButton from "@/components/dashboard/ActionButton";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import {
  HeaderSkeleton,
  PanelSkeleton,
  StatGridSkeleton,
} from "@/components/dashboard/Skeletons";
import {
  IconAlert,
  IconBadge,
  IconBuilding,
  IconDownload,
  IconHourglass,
  IconInbox,
  IconUsers,
} from "@/components/dashboard/icons";
import { countProfilesByRole } from "@/lib/auth/profile";
import { requireRole } from "@/lib/auth/session";
import { formatLongDate } from "@/lib/dashboard/format";
import {
  filterVerificationQueue,
  toVerificationQueueItems,
} from "@/lib/dashboard/verification-queue";
import { listRecentInquiriesForAdmin } from "@/lib/services/admin";
import { getAdminRecap, listAdminProperties } from "@/lib/services/properties";

export const metadata = { title: "Rekap Admin" };

const QUEUE_LIMIT = 20;

/**
 * Ringkasan admin (SRS-F-ADM-05).
 *
 * Semua angka dibaca langsung dari database: rekap properti/pengajuan
 * (`getAdminRecap`), antrean pending (`listAdminProperties`), dan aktivitas
 * terbaru dari pengajuan + pengguna yang baru masuk.
 */
export default function AdminDashboardPage({ searchParams }) {
  return (
    <div className="space-y-5">
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function AdminDashboardContent({ searchParams }) {
  await connection();

  const [profile, params] = await Promise.all([
    requireRole("admin", "/dashboard/admin"),
    searchParams,
  ]);

  const query =
    typeof params?.q === "string" ? params.q.trim() : "";
  const now = new Date();

  const [recap, pending, recentInquiries, userResult] = await Promise.all([
    getAdminRecap(),
    listAdminProperties({ page: 1, pageSize: 200, verificationStatus: "pending" }),
    listRecentInquiriesForAdmin(4),
    countProfilesByRole(),
  ]);

  const userCounts = userResult.ok ? userResult.counts : null;

  const verificationQueue = toVerificationQueueItems(pending.items, now);
  const queue = filterVerificationQueue(verificationQueue, query);
  const oldestPending = pending.items.reduce(
    (oldest, item) => (item.updatedAt < oldest ? item.updatedAt : oldest),
    pending.items[0]?.updatedAt ?? "",
  );
  const oldestPendingDays = oldestPending
    ? Math.max(
        0,
        Math.floor((now.getTime() - new Date(oldestPending).getTime()) / 86_400_000),
      )
    : 0;
  const pendingCount = recap.byVerification.pending ?? 0;

  const listingStatus = {
    verified: recap.byVerification.approved ?? 0,
    pending: pendingCount,
    rejected: recap.byVerification.rejected ?? 0,
    total: recap.totalProperties,
  };

  const recentActivity = recentInquiries.map((inquiry) => ({
    id: inquiry.id,
    type: inquiry.inquiryType === "kunjungan" ? "visit" : "listing",
    actor: inquiry.buyerName,
    action: `${inquiry.inquiryType === "kunjungan" ? "mengajukan kunjungan" : "mengajukan minat beli"} untuk ${inquiry.propertyTitle}`,
    timeLabel: formatLongDate(inquiry.createdAt),
  }));

  const firstName = profile.fullName?.split(" ")[0] || "Admin";

  return (
    <>
      <PageHeader
        eyebrow={["Portal Admin", formatLongDate(now)]}
        title={`Selamat datang, ${firstName}`}
        description="Pantau verifikasi listing, pengguna, dan aktivitas sistem SANG Group."
        actions={
          <>
            <ActionButton
              variant="outline"
              disabled
              title="Ekspor rekap tersedia setelah modul rekap tersambung"
            >
              <IconDownload size={16} />
              Ekspor Rekap
            </ActionButton>
            <ActionButton as="link" href="#antrean-verifikasi" variant="primary">
              <IconBadge size={16} />
              Buka Antrean Verifikasi
            </ActionButton>
          </>
        }
      />

      <div className="flex flex-col gap-3 rounded-dash border border-ag-booked/30 bg-[#fff8e6] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span aria-hidden="true" className="mt-0.5 text-ag-booked">
            <IconAlert size={18} />
          </span>
          <p className="text-[12.5px] leading-relaxed text-ag-slate">
            <span className="font-semibold">
              {pendingCount} listing
            </span>{" "}
            menunggu verifikasi. Terlama masuk {oldestPendingDays} hari
            lalu.
          </p>
        </div>
        <a
          href="#antrean-verifikasi"
          className="shrink-0 pl-6 text-[12px] font-semibold text-ag-slate underline decoration-ag-booked/50 underline-offset-4 hover:text-ag-forest sm:pl-0"
        >
          Tinjau sekarang →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Properti"
          value={recap.totalProperties}
          unit="listing"
          icon={<IconBuilding size={16} />}
          tone="forest"
          footnote={`${recap.byBusiness.tersedia ?? 0} tersedia · ${recap.byBusiness.dipesan ?? 0} dipesan · ${recap.byBusiness.terjual ?? 0} terjual`}
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={pendingCount}
          unit="listing"
          icon={<IconHourglass size={16} />}
          tone="warning"
          footnote={`Terlama ${oldestPendingDays} hari`}
        />
        <StatCard
          label="Total Pengguna"
          value={userCounts ? userCounts.total : "—"}
          unit={userCounts ? "akun" : undefined}
          icon={<IconUsers size={16} />}
          tone="info"
          footnote={
            userCounts
              ? `${userCounts.admin} admin · ${userCounts.agent} agen · ${userCounts.buyer} pembeli`
              : "Data pengguna belum tersedia"
          }
        />
        <StatCard
          label="Total Pengajuan"
          value={recap.totalInquiries}
          unit="pengajuan"
          icon={<IconInbox size={16} />}
          tone="neutral"
          footnote={`${recap.inquiriesByStatus.menunggu ?? 0} masih menunggu tindak lanjut`}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-5">
        <div id="antrean-verifikasi" className="scroll-mt-24">
          <VerificationQueue
            items={queue}
            query={query}
            pendingCount={pendingCount}
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          <ListingStatusPanel status={listingStatus} />
          <RecentActivity items={recentActivity} />
        </div>
      </div>
    </>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-5">
      <HeaderSkeleton />
      <StatGridSkeleton />
      <div className="space-y-5">
        <PanelSkeleton rows={4} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PanelSkeleton rows={3} />
          <PanelSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}
