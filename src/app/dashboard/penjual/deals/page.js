import DealsWorkspace from "@/components/dashboard/deals/DealsWorkspace";
import { getAgentDashboard } from "@/lib/dashboard/agent-data";

export const metadata = { title: "Deals / Pipeline" };

/**
 * Papan Deals / Pipeline penjual.
 *
 * Data masih berasal dari `getAgentDashboard()` (demo) dan bentuknya sama
 * dengan halaman Pengajuan. Saat Prisma disambungkan, query cukup dibatasi
 * `sellerId` pengguna yang sedang login agar penjual tidak pernah melihat
 * pengajuan properti milik penjual lain (SRS-F-SEL-09).
 */
export default function DealsPipelinePage() {
  const { inquiries, properties } = getAgentDashboard();

  return <DealsWorkspace inquiries={inquiries} properties={properties} />;
}
