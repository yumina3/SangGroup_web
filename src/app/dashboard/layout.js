import Navbar from "@/components/agen/Navbar";
import { ToastProvider } from "@/components/dashboard/Toast";
import { getAgentDashboard } from "@/lib/dashboard/agent-data";

export const metadata = {
  title: { default: "Dashboard", template: "%s — Sang Group" },
};

/**
 * Layout grup dashboard — satu-satunya tempat navbar agen dipasang.
 *
 * Navbar (sidebar + topbar + drawer ponsel) tinggal di
 * `src/components/agen/Navbar.js`; layout ini hanya memakainya sekali. Semua
 * halaman `/dashboard/**` otomatis memakai navbar yang sama dan tidak boleh
 * membuat navbar sendiri (SRS §4, SRS-D-07).
 *
 * Layout ini tidak membaca cookies/headers, sehingga kerangka dashboard ikut
 * prerender. Pemeriksaan sesi dan peran (SRS-F-AUTH-03) dijalankan di lapisan
 * server saat modul auth disambungkan. Sampai saat itu `agent` adalah data
 * contoh `AGENT_DEMO`; begitu sesi nyata ada, ganti dengan profil pengguna
 * aktif dan biarkan `null` bila belum masuk — topbar menampilkan "Masuk".
 */
export default function DashboardGroupLayout({ children }) {
  const { agent } = getAgentDashboard();

  return (
    <ToastProvider>
      <div className="ag-scope">
        <Navbar agent={agent}>{children}</Navbar>
      </div>
    </ToastProvider>
  );
}
