import Navbar from "@/components/agen/Navbar";
import { ToastProvider } from "@/components/dashboard/Toast";
import { requirePageUser } from "@/lib/auth/current-user";
import { getAgentProfileView } from "@/lib/services/properties";

export const metadata = {
  title: { default: "Dashboard", template: "%s — Sang Group" },
};

/**
 * Layout grup dashboard agen — satu-satunya tempat navbar agen dipasang.
 *
 * Sesi diperiksa di server pada setiap request: tanpa sesi agen yang sah,
 * pengunjung diarahkan ke gerbang login /penjual. Peran dan status akun
 * dibaca dari database, bukan dari cookie.
 */
export const instant = false;

export default async function DashboardGroupLayout({ children }) {
  const user = await requirePageUser(["agent"]);
  const agent = await getAgentProfileView(user.id);

  return (
    <ToastProvider>
      <div className="ag-scope">
        <Navbar agent={agent}>{children}</Navbar>
      </div>
    </ToastProvider>
  );
}
