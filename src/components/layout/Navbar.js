"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import BrandMark from "@/components/layout/BrandMark";
import { PUBLIC_NAV, navForRole } from "@/components/layout/navlinks";

/**
 * Navbar tunggal yang memilih varian berdasarkan `role` (atau null = publik).
 * Halaman tidak pernah membuat navbar sendiri; layout per role memuat ini.
 */
export default function Navbar({ role = null }) {
  const pathname = usePathname();
  const isAuthed = Boolean(role);
  const links = isAuthed ? navForRole(role) : PUBLIC_NAV;

  return (
    <header
      className={[
        "relative z-20 w-full",
        isAuthed ? "bg-brand-deep" : "bg-brand",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brand-gold/60"
      />

      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <BrandMark tone="light" variant="inline" />

        <nav aria-label={isAuthed ? "Navigasi dashboard" : "Navigasi utama"}>
          <ul className="hidden items-center gap-6 md:flex">
            {links.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href}>
                  {item.ready ? (
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "text-[11px] font-medium uppercase tracking-[0.18em] no-underline transition-colors",
                        isActive
                          ? "text-brand-gold"
                          : "text-brand-cream/80 hover:text-brand-cream",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Halaman belum tersedia"
                      className="cursor-default text-[11px] font-medium uppercase tracking-[0.18em] text-brand-cream/35"
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <Link
              href="/logout"
              className="inline-flex h-10 items-center rounded-sm border border-brand-cream/30 px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-cream no-underline hover:border-brand-cream/60"
            >
              Keluar
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden h-10 items-center px-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-cream/85 no-underline hover:text-brand-cream sm:inline-flex"
              >
                Masuk
              </Link>
              <Link
                href="/pasang-properti"
                className="inline-flex h-10 items-center rounded-sm bg-brand-gold px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-deep no-underline hover:bg-brand-gold-soft"
              >
                Pasang Properti
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
