import PusatBantuanPenjual from "@/components/dashboard/help/PusatBantuanPenjual";
import {
  HELP_FAQS,
  HELP_QUICK_GUIDES,
  HELP_SUPPORT,
  HELP_SYSTEM_STATUS,
} from "@/lib/dashboard/help-data";

export const metadata = { title: "Pusat Bantuan" };

/**
 * Layout agen memeriksa sesi dan melakukan redirect; halaman ini tidak perlu
 * divalidasi sebagai navigasi instan. Samakan dengan layout `/dashboard/penjual`
 * agar validasi Cache Components tidak mencoba merender halaman saat redirect.
 */
export const instant = false;

/**
 * Pusat Bantuan agen (pengembangan lanjutan SRS §3.5).
 *
 * Navbar/sidebar dipasang sekali oleh `src/app/dashboard/penjual/layout.js`;
 * halaman ini hanya mengisi konten utama. Konten panduan berupa dokumentasi
 * statis; pencarian dan accordion ditangani workspace klien.
 */
export default function AgentHelpCenterPage() {
  return (
    <PusatBantuanPenjual
      guides={HELP_QUICK_GUIDES}
      faqs={HELP_FAQS}
      support={HELP_SUPPORT}
      systemStatus={HELP_SYSTEM_STATUS}
    />
  );
}
