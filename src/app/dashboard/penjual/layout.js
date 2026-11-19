import Navbar from "@/components/agen/Navbar";
import { ToastProvider } from "@/components/dashboard/Toast";
import { requireRole } from "@/lib/auth/session";
import { getAgentDashboard } from "@/lib/dashboard/agent-data";

export const metadata = {
  title: { default: "Dashboard Agen", template: "%s — SANG Group" },
};

/** Layout ini memeriksa sesi di setiap request, jadi tidak diprerender. */
export const instant = false;

/**
 * Satu-satunya tempat navbar agen dipasang. Semua halaman di bawah
 * `/dashboard/penjual` memakai sidebar dan topbar yang sama.
 */
export default async function AgentLayout({ children }) {
  const profile = await requireRole("agent", "/dashboard/penjual");

  // Data contoh dashboard tetap dipakai sampai modul properti tersambung,
  // tetapi identitas yang tampil diambil dari profil yang sedang login.
  const demoAgent = getAgentDashboard().agent;
  const agent = {
    ...demoAgent,
    id: profile.id,
    name: profile.fullName ?? demoAgent.name,
    email: profile.email ?? demoAgent.email,
    phone: profile.phone ?? demoAgent.phone,
    agencyName: profile.agencyName ?? demoAgent.agencyName,
  };

  return (
    <ToastProvider>
      <div className="ag-scope">
        <Navbar agent={agent}>{children}</Navbar>
      </div>
    </ToastProvider>
  );
}
