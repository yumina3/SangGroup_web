import PengaturanPenjual from "@/components/dashboard/settings/PengaturanPenjual";

export const metadata = { title: "Pengaturan" };

/**
 * Pengaturan akun penjual — profil, keamanan, dan preferensi notifikasi.
 * Navbar/sidebar agen disediakan layout `/dashboard`, bukan halaman ini.
 */
export default function AgentSettingsPage() {
  return <PengaturanPenjual />;
}
