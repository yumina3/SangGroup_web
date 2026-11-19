/**
 * Satu sumber kebenaran untuk tautan navigasi.
 *
 * Halaman tidak pernah mendeklarasikan navbar sendiri: layout per role memilih
 * varian di sini. Tautan yang halamannya belum ada ditandai `ready: false`
 * supaya Navbar bisa menonaktifkannya alih-alih menuju 404.
 */

export const PUBLIC_NAV = [
  { label: "Home", href: "/", ready: true },
  { label: "About", href: "/about", ready: false },
  { label: "Products", href: "/products", ready: false },
  { label: "Facilities", href: "/facilities", ready: false },
  { label: "Location", href: "/location", ready: false },
  { label: "News", href: "/news", ready: false },
  { label: "Contact", href: "/contact", ready: false },
];

export const ROLE_NAV = {
  buyer: [
    { label: "Ringkasan", href: "/dashboard/pembeli", ready: false },
    { label: "Favorit", href: "/dashboard/pembeli/favorit", ready: false },
    { label: "Pengajuan", href: "/dashboard/pembeli/pengajuan", ready: false },
    { label: "Profil", href: "/dashboard/pembeli/profil", ready: false },
  ],
  agent: [
    { label: "Dashboard", href: "/dashboard/penjual", ready: false },
    { label: "Properties", href: "/dashboard/penjual/properti", ready: false },
    { label: "Pipeline", href: "/dashboard/penjual/pengajuan", ready: false },
    { label: "Masterplan", href: "/dashboard/penjual/properti/baru", ready: false },
    { label: "Settings", href: "/dashboard/penjual/pengaturan", ready: false },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", ready: false },
    { label: "Verification", href: "/dashboard/admin/verifikasi", ready: false },
    { label: "Users", href: "/dashboard/admin/pengguna", ready: false },
    { label: "Categories", href: "/dashboard/admin/kategori", ready: false },
    { label: "Recap", href: "/dashboard/admin/rekap", ready: false },
    { label: "Settings", href: "/dashboard/admin/pengaturan", ready: false },
  ],
};

export function navForRole(role) {
  return ROLE_NAV[role] ?? [];
}
