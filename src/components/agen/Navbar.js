"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";



import AgentAvatar from "@/components/dashboard/AgentAvatar";
import {
  IconBell,
  IconCalendar,
  IconChevronDown,
  IconClose,
  IconMenu,
  IconPlus,
  IconSearch,
} from "@/components/dashboard/icons";
import { AGENT_NAV_GROUPS, FALLBACK_NAV_ICON, NAV_STATUS } from "./agent-nav";

/**
 * NAVBAR AGEN — satu-satunya tempat sidebar dan topbar dashboard agen
 * dideklarasikan.
 *
 * Dipasang sekali di `src/app/dashboard/layout.js`; semua halaman
 * `/dashboard/**` (ringkasan, properti, pengajuan, pengaturan, dst.) memakai
 * navbar ini tanpa membuat navbar sendiri.
 *
 * Struktur: Sidebar (desktop) + Topbar + Drawer menu (ponsel), lalu `children`
 * dirender di konten utama. Komponen ini tidak membaca `usePathname()`
 * sehingga tidak bergantung pada data URL saat prerender; sorotan menu aktif
 * dipasang `MenuDrawer` setelah halaman interaktif.
 */
export default function Navbar({ agent, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-ag-ivory font-sans text-ag-slate">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ag-forest focus:shadow-lg"
      >
        Lompat ke konten utama
      </a>

      {/* Hijau tua setinggi penuh dari atas sampai dasar layar. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--ag-sidebar-w)] lg:block">
        <Sidebar />
      </aside>

      <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="lg:pl-[var(--ag-sidebar-w)]">
        <Topbar
          agent={agent}
          menuOpen={drawerOpen}
          onToggleMenu={() => setDrawerOpen((value) => !value)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1200px] px-4 py-6 outline-none md:px-6 md:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * Sidebar dashboard agen untuk layar lebar (≥1024 px).
 *
 * Latar hijau tua menutup seluruh tinggi layar. Hanya area menu yang
 * menggulir bila daftar melebihi tinggi layar; kepala merek dan tautan
 * "kembali ke situs" tetap menempel.
 */
export function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-ag-sidebar text-white">
      <div className="shrink-0">
        <SidebarBrand />
      </div>

      <div className="ag-sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        <SidebarNav />
      </div>

      <div className="shrink-0 border-t border-white/10 px-3 py-3">
        <Link
          href="/"
          className="flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
        >
          Kembali ke situs publik
        </Link>
      </div>
    </div>
  );
}

/** Kepala sidebar: kotak ikon + kata merek seperti desain agen. */
export function SidebarBrand({ onNavigate, compact = false }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={["flex items-center gap-3 no-underline", compact ? "h-14 px-5" : "h-20 px-6"].join(
        " ",
      )}
      aria-label="Sang Group — beranda"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_sang.png"
          alt=""
          width={24}
          height={24}
          className="h-6 w-auto object-contain"
        />
      </span>
      <span className="block leading-none">
        <span className="block text-[15px] font-semibold tracking-tight text-white">SANG GROUP</span>
        <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-ag-gold-light">
          Estate System
        </span>
      </span>
    </Link>
  );
}

/**
 * Daftar menu lengkap (dipakai versi desktop dan drawer).
 *
 * Semua item selalu tampil — yang belum dibangun diberi keterangan "Segera",
 * bukan dibuang — sehingga pengguna tinggal menggulir sidebar untuk melihat
 * seluruh menu. Sorotan menu aktif dipasang `MenuDrawer` lewat atribut
 * `data-nav-href` (lihat `menu-active.js`).
 */
export function SidebarNav({ onNavigate }) {
  return (
    <nav aria-label="Navigasi dashboard agen" className="flex flex-col pb-6">
      {AGENT_NAV_GROUPS.map((group, groupIndex) => (
        <div key={group.title ?? `group-${groupIndex}`}>
          {group.title ? (
            <p className="px-3 pb-1.5 pt-5 text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-ag-slate-muted">
              {group.title}
            </p>
          ) : null}

          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon ?? FALLBACK_NAV_ICON;
              const ready = item.status === NAV_STATUS.ready;

              return (
                <li key={item.label}>
                  {ready ? (
                    <a
                      href={item.href}
                      onClick={onNavigate}
                      data-nav-href={item.href}
                      className="ag-nav-link flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium leading-5 text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <Icon size={18} className="ag-nav-icon shrink-0 text-white/70" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <span
                        aria-hidden="true"
                        className="ag-nav-indicator h-3.5 w-[3px] shrink-0 rounded-full bg-ag-gold-base"
                      />
                    </a>
                  ) : (
                    <span
                      className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] leading-5 text-white/40"
                      title="Belum termasuk rilis ini"
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="shrink-0 rounded-tag bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/60">
                        Segera
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/**
 * Topbar dashboard agen (pencarian, Tambah Listing, jadwal, pengajuan, profil).
 *
 * Bila `agent` kosong (sesi belum tersambung) yang tampil adalah tombol
 * "Masuk" — nama agen tidak dikarang (SRS-D-03).
 */
export function Topbar({ agent, onToggleMenu, menuOpen = false }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ag-line bg-white px-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] md:h-20 md:gap-4 md:px-6">
      <button
        type="button"
        onClick={onToggleMenu}
        aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        aria-controls="agent-menu-drawer"
        aria-expanded={menuOpen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest lg:hidden"
      >
        <IconMenu />
      </button>

      <form
        role="search"
        action="/dashboard/penjual/properti"
        className="hidden min-w-0 flex-1 md:block md:max-w-xl"
      >
        <div className="relative flex items-center">
          <IconSearch
            size={20}
            className="pointer-events-none absolute left-3 text-ag-slate-secondary"
          />
          <label htmlFor="agent-search" className="sr-only">
            Cari nama properti, lokasi, atau nomor unit
          </label>
          <input
            id="agent-search"
            name="q"
            type="search"
            placeholder="Cari kaveling, nomor unit, atau nama klien..."
            className="h-10 w-full rounded-lg border border-ag-line bg-ag-surface-low pl-10 pr-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted transition-colors focus:border-ag-gold-base focus:bg-white focus:outline-none"
          />
        </div>
      </form>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none md:gap-3">
        <a
          href="/dashboard/penjual/properti/baru"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-ag-forest px-3 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-ag-forest-medium"
        >
          <IconPlus size={18} />
          <span className="hidden sm:inline">Tambah Listing</span>
          <span className="sr-only sm:hidden">Tambah Listing</span>
        </a>

        <div className="flex items-center gap-0.5">
          <a
            href="/dashboard/penjual/pengajuan?tab=jadwal"
            aria-label="Jadwal kunjungan"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest"
          >
            <IconCalendar size={20} />
          </a>
          <a
            href="/dashboard/penjual/pengajuan"
            aria-label="Pengajuan masuk"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest"
          >
            <IconBell size={20} />
          </a>
        </div>

        <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-ag-line sm:block" />

        {agent ? (
          <div className="relative flex items-center gap-2.5">
            <a
              href="/dashboard/penjual/pengaturan"
              className="flex items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-ag-surface-low"
              aria-label={`Profil agen ${agent.name} — buka pengaturan`}
            >
              <AgentAvatar agent={agent} />
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-[13px] font-bold text-ag-slate">{agent.name}</span>
                <span className="text-[11px] text-ag-slate-muted">Agen · {agent.agentCode}</span>
              </span>
              <IconChevronDown size={16} className="hidden text-ag-slate-muted sm:block" />
            </a>
          </div>
        ) : (
          <a
            href="/login?next=/dashboard/penjual"
            className="rounded-lg bg-ag-forest px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-ag-forest-medium"
          >
            Masuk
          </a>
        )}
      </div>
    </header>
  );
}

/**
 * Drawer menu ponsel + penyorot menu aktif.
 *
 * Menutup sendiri saat rute berubah, mengurung fokus selama terbuka, dan
 * menutup dengan Escape atau klik latar. Sorotan menu aktif dibandingkan
 * dengan `window.location.pathname` (bukan `usePathname()`), sehingga navbar
 * tidak bergantung pada data URL dan halaman tetap bisa diprerender.
 */
export function MenuDrawer({ open, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  const markerRef = useRef("");
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  // Pathname dibaca ulang tiap drawer dibuka dan tiap tombol kembali/kedepan
  // browser dipakai — tanpa hook router yang menandai komponen sebagai dinamis.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    function sync() {
      setPathname(window.location.pathname);
    }

    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [open]);  useEffect(() => {
    if (markerRef.current === pathname) return;
    markerRef.current = pathname;
    applyActiveNav(pathname);
  }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a, button")?.focus();

    function handleKey(event) {
      if (event.key === "Escape") {
        closeRef.current?.();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        id="agent-menu-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={open ? undefined : true}
        aria-label="Menu navigasi dashboard agen"
        className={`absolute inset-y-0 left-0 flex w-[min(85vw,18rem)] flex-col bg-ag-sidebar text-white shadow-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between pr-2">
          <SidebarBrand compact onNavigate={onClose} />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
          >
            <IconClose size={18} />
            <span className="sr-only">Tutup menu</span>
          </button>
        </div>

        <div className="ag-sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-2">
          <SidebarNav onNavigate={onClose} />
        </div>

        <div className="shrink-0 border-t border-white/10 px-3 py-3">
          <Link
            href="/"
            className="flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            Kembali ke situs publik
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Tandai `aria-current="page"` pada menu yang cocok dengan pathname. */
function applyActiveNav(pathname) {
  if (typeof document === "undefined") return;

  for (const link of document.querySelectorAll("[data-nav-href]")) {
    const href = link.getAttribute("data-nav-href") ?? "";
    const active =
      href === "/dashboard/penjual"
        ? pathname === href
        : pathname === href || pathname.startsWith(`${href}/`);

    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}
