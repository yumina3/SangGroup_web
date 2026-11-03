import { redirect } from "next/navigation";

import Navbar from "@/components/agen/Navbar";
import { ToastProvider } from "@/components/dashboard/Toast";
import { currentPenjualAgent, readPenjualSession } from "@/lib/auth/penjual-session";

export const metadata = {
  title: { default: "Dashboard", template: "%s — Sang Group" },
};

/**
 * Layout ini memeriksa sesi (cookie) di setiap request, jadi seluruh rute di
 * dalamnya tidak bisa diprerender. Dinyatakan sekali di sini; halaman di
 * dalamnya tetap memakai <Suspense> untuk data yang lambat.
 */
export const instant = false;

/**
 * Layout grup dashboard — satu-satunya tempat navbar agen dipasang.
 *
 * Navbar (sidebar + topbar + drawer ponsel) tinggal di
 * `src/components/agen/Navbar.js`; layout ini hanya memakainya sekali. Semua
 * halaman `/dashboard/**` otomatis memakai navbar yang sama dan tidak boleh
 * membuat navbar sendiri (SRS §4, SRS-D-07).
 *
 * Pemeriksaan sesi: tanpa cookie sesi /penjual yang sah, pengunjung langsung
 * diarahkan ke gerbang login /penjual. Cookie itu hanya ditulis oleh Server
 * Action login penjual, sehingga layout ini dirender di request time.
 */
export default async function DashboardGroupLayout({ children }) {
  const session = await readPenjualSession();
  if (!session) redirect("/penjual");

  const agent = currentPenjualAgent();

  return (
    <ToastProvider>
      <div className="ag-scope">
        <Navbar agent={agent}>{children}</Navbar>
      </div>
    </ToastProvider>
  );
}
