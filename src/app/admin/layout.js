import Link from "next/link";
import { headers } from "next/headers";

import { logoutAction } from "@/app/penjual/actions";
import { requirePageUser } from "@/lib/auth/current-user";

export const metadata = { title: "Admin — SANG Group" };
export const instant = false;

const NAV = [
  { href: "/admin", label: "Ringkasan", exact: true },
  { href: "/admin/properti", label: "Listing" },
  { href: "/admin/pengajuan", label: "Pengajuan" },
  { href: "/admin/kategori", label: "Kategori" },
  { href: "/admin/proyek", label: "Proyek" },
  { href: "/admin/pengguna", label: "Pengguna" },
];

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default async function AdminLayout({ children }) {
  const user = await requirePageUser(["admin"]);
  const pathname = (await headers()).get("x-pathname") ?? "/admin";

  return (
    <div className="min-h-dvh bg-ag-ivory text-ag-slate">
      <header className="border-b border-ag-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ag-slate-muted">
              Panel Admin
            </p>
            <p className="text-[15px] font-bold">{user.fullName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-ag-line px-3 py-1.5 text-[12px] font-semibold hover:bg-ag-surface-low"
            >
              Lihat situs
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-ag-line px-3 py-1.5 text-[12px] font-semibold hover:bg-ag-surface-low"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Navigasi admin" className="mx-auto max-w-7xl overflow-x-auto px-4">
          <ul className="flex gap-1 border-t border-ag-line pt-2">
            {NAV.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex whitespace-nowrap rounded-t-lg px-3 py-2 text-[12.5px] font-semibold ${
                      active
                        ? "border-b-2 border-ag-gold-base text-ag-forest"
                        : "border-b-2 border-transparent text-ag-slate-secondary hover:text-ag-slate"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
