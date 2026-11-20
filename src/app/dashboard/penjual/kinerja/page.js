import AgentPerformanceWorkspace from "@/components/dashboard/analytics/AgentPerformanceWorkspace";
import { getAgentProfile } from "@/lib/dashboard/agent-data";
import { getAgentPerformanceDatasets } from "@/lib/dashboard/analytics-data";

export const metadata = { title: "Kinerja Agen" };

/**
 * Kinerja agen penjual.
 *
 * Profil agen dan dataset per periode disiapkan di server; seluruh interaksi
 * filter dan unduhan berjalan di workspace klien.
 */
export default async function AgentPerformancePage() {
  const [datasets, agent] = await Promise.all([
    getAgentPerformanceDatasets(),
    getAgentProfile(),
  ]);

  return <AgentPerformanceWorkspace datasets={datasets} agent={agent} />;
}
