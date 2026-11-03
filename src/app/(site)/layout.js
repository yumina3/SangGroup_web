import FooterSite from "@/components/site/FooterSite";
import NavbarSite from "@/components/site/NavbarSite";

/**
 * Layout role pengguna (situs publik).
 *
 * Navbar dan footer dimuat SEKALI di sini lalu dipakai ulang oleh semua
 * halaman di grup (site)/. Halaman tidak boleh membuat navbar/footer sendiri.
 *
 * Layout sengaja tidak membaca `headers()`: itu membuat seluruh grup rute
 * menjadi dinamis dan menggagalkan prerender saat build. Penanda menu aktif
 * dihitung di NavbarSite sendiri lewat `usePathname()`.
 */
export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800 antialiased">
      <NavbarSite />
      <main className="flex-1">{children}</main>
      <FooterSite />
    </div>
  );
}
