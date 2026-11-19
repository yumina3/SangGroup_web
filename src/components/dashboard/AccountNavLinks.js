"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Menu portal pembeli/admin dengan penanda halaman aktif.
 *
 * Halaman ringkasan harus cocok persis agar tautan "/dashboard/pembeli" tidak
 * ikut aktif saat pembeli membuka subhalaman favorit.
 */
function isActive(href, pathname) {
  if (!href || !pathname) return false;
  if (href === "/dashboard/pembeli" || href === "/dashboard/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountNavLinks({ nav = [] }) {
  const pathname = usePathname();

  return (
    <ul className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-3 sm:px-6">
      {nav.map((item) => {
        const active = isActive(item.href, pathname);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex whitespace-nowrap border-b-2 px-3 py-2.5 text-[12px] font-semibold no-underline transition-colors ${
                active
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-brand-cream/70 hover:text-brand-gold"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
