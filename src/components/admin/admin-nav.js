import {
  IconAlert,
  IconBadge,
  IconChart,
  IconHome,
  IconList,
  IconMap,
  IconSettings,
  IconUsers,
} from "@/components/dashboard/icons";

/**
 * Status menu sidebar admin.
 *
 * - "ready" : halaman sudah dibangun dan bisa diklik.
 * - "later" : layar sudah ada di docs/admin tetapi modulnya dikerjakan pada
 *             tahap berikutnya. Menu tetap tampil dengan label "Segera" agar
 *             pengguna tahu urutannya, bukan disembunyikan.
 */
export const ADMIN_NAV_STATUS = {
  ready: "ready",
  later: "later",
};

/**
 * Menu sidebar admin mengikuti kelompok pada
 * docs/admin/dashboard_admin_sang_group_semarang_icon_update.
 */
export const ADMIN_NAV_GROUPS = [
  {
    title: "Operasional Admin",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard/admin",
        status: ADMIN_NAV_STATUS.ready,
        icon: IconHome,
      },
      {
        label: "Verifikasi Listing",
        href: "/dashboard/admin#antrean-verifikasi",
        status: ADMIN_NAV_STATUS.ready,
        icon: IconBadge,
      },
      {
        label: "Pengguna",
        href: "/admin/pengguna",
        status: ADMIN_NAV_STATUS.ready,
        icon: IconUsers,
      },
      {
        label: "Kategori",
        href: "/admin/kategori",
        status: ADMIN_NAV_STATUS.ready,
        icon: IconList,
      },
      {
        label: "Moderasi Data",
        href: null,
        status: ADMIN_NAV_STATUS.later,
        icon: IconAlert,
        badge: 4,
        badgeTone: "danger",
      },
    ],
  },
  {
    title: "Laporan & GIS",
    items: [
      {
        label: "Rekap Properti",
        href: "/admin",
        status: ADMIN_NAV_STATUS.ready,
        icon: IconChart,
      },
      {
        label: "Masterplan GIS",
        href: null,
        status: ADMIN_NAV_STATUS.later,
        icon: IconMap,
      },
    ],
  },
  {
    title: "Pengaturan Sistem",
    items: [
      {
        label: "Pengaturan Sistem",
        href: null,
        status: ADMIN_NAV_STATUS.later,
        icon: IconSettings,
      },
    ],
  },
];
