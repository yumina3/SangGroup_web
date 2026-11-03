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
    { label: "Ringkasan", href: "/pembeli", ready: false },
    { label: "Favorit", href: "/pembeli/favorit", ready: false },
    { label: "Pengajuan", href: "/pembeli/pengajuan", ready: false },
    { label: "Profil", href: "/pembeli/profil", ready: false },
  ],
  agent: [
    { label: "Dashboard", href: "/agen", ready: false },
    { label: "Properties", href: "/agen/properti", ready: false },
    { label: "Pipeline", href: "/agen/pipeline", ready: false },
    { label: "Masterplan", href: "/agen/masterplan", ready: false },
    { label: "Settings", href: "/agen/pengaturan", ready: false },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", ready: false },
    { label: "Verification", href: "/admin/verifikasi", ready: false },
    { label: "Users", href: "/admin/pengguna", ready: false },
    { label: "Categories", href: "/admin/kategori", ready: false },
    { label: "Recap", href: "/admin/rekap", ready: false },
    { label: "Settings", href: "/admin/pengaturan", ready: false },
  ],
};

export function navForRole(role) {
  return ROLE_NAV[role] ?? [];
}
