import {
  IconBadge,
  IconBuilding,
  IconChart,
  IconCheckSquare,
  IconFunnel,
  IconHelp,
  IconHome,
  IconInbox,
  IconKanban,
  IconMap,
  IconMessage,
  IconPlug,
  IconSettings,
  IconSliders,
  IconUsers,
} from "@/components/dashboard/icons";

/**
 * Status sebuah rute dashboard.
 *
 * - "ready"      : halaman ada di SRS §4 dan sudah dibangun.
 * - "later"      : halaman ada di SRS §4 tetapi modulnya dikerjakan terpisah.
 * - "outOfScope" : layar ada di docs/agen tetapi SRS §3.5 menyatakan tidak
 *                  dibangun, jadi menu hanya ditampilkan dengan keterangan
 *                  "Segera" dan tidak bisa diklik.
 */
export const NAV_STATUS = {
  ready: "ready",
  later: "later",
  outOfScope: "outOfScope",
};

/**
 * Menu sidebar dashboard agen.
 *
 * Struktur halaman mengikuti SRS §4; pengelompokan dan ikon mengikuti berkas
 * desain agen (Operasional, Intelligence & GIS, Pengaturan Sistem).
 */
export const AGENT_NAV_GROUPS = [
  {
    title: null,
    items: [
      {
        label: "Ringkasan",
        href: "/dashboard/penjual",
        status: NAV_STATUS.ready,
        icon: IconHome,
      },
    ],
  },
  {
    title: "Operasional",
    items: [
      {
        label: "Properti Saya",
        href: "/dashboard/penjual/properti",
        status: NAV_STATUS.ready,
        icon: IconBuilding,
      },
      {
        label: "Pengajuan Masuk",
        href: "/dashboard/penjual/pengajuan",
        status: NAV_STATUS.ready,
        icon: IconInbox,
      },
      { label: "Deals / Pipeline", href: null, status: NAV_STATUS.outOfScope, icon: IconKanban },
      { label: "Tugas Tindak Lanjut", href: null, status: NAV_STATUS.outOfScope, icon: IconCheckSquare },
      { label: "Kontak", href: null, status: NAV_STATUS.outOfScope, icon: IconUsers },
      { label: "Pesan", href: null, status: NAV_STATUS.outOfScope, icon: IconMessage },
    ],
  },
  {
    title: "Intelligence & GIS",
    items: [
      { label: "Analitik Penjualan", href: null, status: NAV_STATUS.outOfScope, icon: IconChart },
      { label: "Kinerja Agen", href: null, status: NAV_STATUS.outOfScope, icon: IconBadge },
      { label: "Corong Konversi", href: null, status: NAV_STATUS.outOfScope, icon: IconFunnel },
      { label: "Masterplan GIS", href: null, status: NAV_STATUS.outOfScope, icon: IconMap },
    ],
  },
  {
    title: "Pengaturan Sistem",
    items: [
      { label: "Integrasi Layanan", href: null, status: NAV_STATUS.outOfScope, icon: IconPlug },
      {
        label: "Pengaturan",
        href: "/dashboard/penjual/pengaturan",
        status: NAV_STATUS.ready,
        icon: IconSliders,
      },
      { label: "Pusat Bantuan", href: null, status: NAV_STATUS.outOfScope, icon: IconHelp },
    ],
  },
];

/** Ikon cadangan bila item menu belum punya ikon. */
export const FALLBACK_NAV_ICON = IconSettings;

/** Menu aktif ditentukan dari pathname (prefix terpanjang yang cocok). */
export function isNavActive(href, pathname) {
  if (!href || !pathname) return false;
  if (href === "/dashboard/penjual") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
