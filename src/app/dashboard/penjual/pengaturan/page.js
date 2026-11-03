import { Suspense } from "react";

import PengaturanPenjual from "@/components/dashboard/settings/PengaturanPenjual";

export const metadata = { title: "Pengaturan" };

/**
 * Pengaturan akun penjual — profil, keamanan, dan preferensi notifikasi.
 * Navbar/sidebar agen disediakan layout `/dashboard`, bukan halaman ini.
 *
 * `?tab=keamanan|notifikasi` membuka tab tersebut langsung; dibaca di dalam
 * <Suspense> agar shell halaman tetap statis.
 */
export default function AgentSettingsPage({ searchParams }) {
  return (
    <Suspense fallback={<PengaturanPenjual />}>
      <SettingsSection searchParams={searchParams} />
    </Suspense>
  );
}

async function SettingsSection({ searchParams }) {
  const params = (await searchParams) ?? {};
  const tab = typeof params.tab === "string" ? params.tab : "profil";
  return <PengaturanPenjual initialTab={tab} />;
}
