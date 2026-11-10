import { Suspense } from "react";

import PengaturanPenjual from "@/components/dashboard/settings/PengaturanPenjual";
import { requirePageUser } from "@/lib/auth/current-user";
import { getAgentProfileView } from "@/lib/services/properties";

export const metadata = { title: "Pengaturan" };

/**
 * Pengaturan akun penjual — profil, keamanan, dan preferensi notifikasi.
 * Navbar/sidebar agen disediakan layout `/dashboard`, bukan halaman ini.
 *
 * `?tab=keamanan|notifikasi` membuka tab tersebut langsung.
 */
export const instant = false;

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
  const user = await requirePageUser(["agent"]);
  const agent = await getAgentProfileView(user.id);

  return <PengaturanPenjual agent={agent} initialTab={tab} />;
}
