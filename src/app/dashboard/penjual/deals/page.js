import DealsWorkspace from "@/components/dashboard/deals/DealsWorkspace";
import { getAgentDashboard } from "@/lib/dashboard/agent-data";

export const metadata = { title: "Deals / Pipeline" };

/**
 * Papan Deals / Pipeline penjual.
 *
 * Data berasal dari `getAgentDashboard()` yang sudah membaca pengajuan milik
 * agen yang sedang login, sehingga penjual tidak pernah melihat pengajuan
 * properti milik penjual lain (SRS-F-SEL-09).
 */
export default async function DealsPipelinePage() {
  const { inquiries, properties } = await getAgentDashboard();

  return <DealsWorkspace inquiries={inquiries} properties={properties} />;
}
