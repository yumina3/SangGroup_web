"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Satu-satunya navbar untuk role pengguna (situs publik).
 *
 * Dipakai ulang oleh SEMUA halaman di (site)/ lewat layout — tidak ada halaman
 * yang membuat navbar sendiri.
 *
 * Struktur mengikuti berkas code.html di tiap folder docs/site:
 *   1. Header putih: wordmark "Sang [compass] Group" + tagline.
 *   2. Bar hijau: menu tengah + kontrol audio & ID/EN di kanan.
 *
 * Aturan tautan (keputusan produk):
 *  - Di beranda (`/`), menu berupa anchor ke section halaman yang sama.
 *  - Di halaman lain, menu mengarah ke `/#section` supaya kembali ke beranda
 *    lalu melompat ke section terkait.
 */

export const SITE_NAV = [
  { label: "Home", href: "/", hash: "" },
  { label: "About", href: "/about", hash: "" },
  { label: "Products", href: "/sang-dipa", hash: "" },
  { label: "Facilities", href: "/fasilitas", hash: "" },
  { label: "Location", href: "/lokasi", hash: "" },
  { label: "News", href: "/berita", hash: "" },
  { label: "Contact", href: "/kontak", hash: "" },
];

/** Ikon kompas di antara "Sang" dan "Group". */
/** Logo resmi Sang Group (public/logo_sang.png), dipakai di wordmark. */
function BrandLogo() {
  return (
    <span aria-hidden="true" className="mx-2 inline-flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo_sang.png"
        alt=""
        width={22}
        height={22}
        className="h-[22px] w-auto object-contain"
      />
    </span>
  );
}
/** Resolusi href akhir untuk satu item menu. */
function resolveHref(item, isHome) {
  if (!item.hash) return item.href;
  return isHome ? item.hash : `${item.href}${item.hash}`;
}

export default function NavbarSite() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  return (
    <>
      {/* ---- Tier 1: identitas brand ---- */}
      <header className="w-full bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center leading-none"
            aria-label="Sang Group — beranda"
          >
            <span className="font-serif text-3xl font-bold italic tracking-tight text-site-forest md:text-4xl">
              Sang
            </span>
            <BrandLogo />
            <span className="font-serif text-3xl font-bold italic tracking-tight text-[#C5A059] md:text-4xl">
              Group
            </span>
          </Link>
          <p className="mt-1 text-center font-sans text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-500 md:text-[10px]">
            Residential &amp; Lifestyle Community
          </p>
        </div>
      </header>

      {/* ---- Tier 2: bar navigasi hijau ---- */}
      <nav
        aria-label="Navigasi utama"
        className="sticky top-0 z-50 bg-[#0B3126] font-sans text-xs text-white shadow-sm"
      >
        <div className="relative mx-auto flex h-11 max-w-7xl items-center justify-center px-6 lg:px-16">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 font-sans text-[11px] font-semibold uppercase tracking-wider text-gray-200 sm:gap-x-7 md:gap-x-9">
            {SITE_NAV.map((item) => {
              const active = item.hash
                ? pathname === item.href
                : pathname === item.href;

              return (
                <li key={item.label}>
                  <a
                    href={resolveHref(item, isHome)}
                    aria-current={active ? "page" : undefined}
                    className={`transition-colors duration-200 hover:text-[#C5A059] ${
                      active ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="absolute right-6 flex items-center space-x-1.5 font-sans text-[11px] font-semibold lg:right-16">
            <span className="cursor-pointer text-[#C5A059]">ID</span>
            <span className="font-normal text-gray-400">|</span>
            <span className="cursor-pointer font-normal text-white hover:text-[#C5A059]">
              EN
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
