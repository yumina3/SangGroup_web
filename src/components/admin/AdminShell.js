"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import AgentAvatar from "@/components/dashboard/AgentAvatar";
import {
  IconArrowRight,
  IconBell,
  IconChevronDown,
  IconClose,
  IconExit,
  IconHome,
  IconMenu,
  IconSearch,
} from "@/components/dashboard/icons";
import { ADMIN_NAV_GROUPS, ADMIN_NAV_STATUS } from "./admin-nav";

/**
 * Kerangka dashboard admin: sidebar hijau tua, topbar putih, dan drawer untuk
 * layar kecil. Mengikuti docs/admin/dashboard_admin_sang_group_semarang_icon_update.
 *
 * Layout admin sudah dinamis karena memeriksa sesi, jadi sorotan menu aktif
 * boleh memakai `usePathname()` tanpa mengorbankan prerender halaman publik.
 */
export default function AdminShell({ profile, logoutAction, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="ag-scope min-h-dvh bg-ag-surface-low font-sans text-ag-slate">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ag-forest focus:shadow-lg"
      >
        Lompat ke konten utama
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] lg:block">
        <AdminSidebar profile={profile} logoutAction={logoutAction} />
      </aside>

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        profile={profile}
        logoutAction={logoutAction}
      />

      <div className="lg:pl-[240px]">
        <AdminTopbar
          profile={profile}
          logoutAction={logoutAction}
          menuOpen={drawerOpen}
          onToggleMenu={() => setDrawerOpen((value) => !value)}
        />

        <main
          id="admin-main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] px-4 py-6 outline-none md:px-6 md:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/** Sidebar desktop: merek, menu, identitas admin, dan versi sistem. */
function AdminSidebar({ profile, logoutAction, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-ag-sidebar text-white">
      <SidebarBrand onNavigate={onNavigate} />
      <SidebarContent
        profile={profile}
        logoutAction={logoutAction}
        onNavigate={onNavigate}
      />
    </div>
  );
}

function SidebarBrand({ onNavigate, compact = false }) {
  return (
    <div className="shrink-0 border-b border-white/10">
      <Link
        href="/"
        onClick={onNavigate}
        aria-label="Sang Group — beranda"
        className={[
          "flex items-center gap-3 no-underline",
          compact ? "h-14 px-4" : "h-20 px-5",
        ].join(" ")}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo_sang.png"
            alt=""
            width={22}
            height={22}
            className="h-6 w-auto object-contain"
          />
        </span>
        <span className="block leading-none">
          <span className="block text-[14px] font-bold uppercase tracking-[0.12em] text-white">
            SANG GROUP
          </span>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-ag-gold-light">
            Estate System
          </span>
        </span>
      </Link>

      <div className="px-5 pb-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
          Administrator
        </span>
      </div>
    </div>
  );
}

function SidebarContent({ profile, logoutAction, onNavigate }) {
  return (
    <>
      <div className="ag-sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        <SidebarNav onNavigate={onNavigate} />
      </div>

      <div className="shrink-0 border-t border-white/10 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <AgentAvatar
            agent={{ name: profile.fullName, avatarUrl: null }}
            size={30}
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[12.5px] font-semibold text-white">
              {profile.fullName}
            </span>
            <span className="block truncate text-[10.5px] text-ag-gold-light">
              Administrator
            </span>
          </span>
        </div>

        <Link
          href="/"
          onClick={onNavigate}
          className="flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
        >
          Kembali ke situs publik
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex min-h-9 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12.5px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <IconExit size={16} />
            Keluar
          </button>
        </form>

        <p className="mt-3 px-3 text-[10px] uppercase tracking-[0.14em] text-white/35">
          SANG Core v2.4
        </p>
      </div>
    </>
  );
}

function SidebarNav({ onNavigate }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  // `/dashboard/admin#antrean-verifikasi` dan `/dashboard/admin` berbagi
  // pathname, jadi menu yang aktif juga ditentukan oleh hash.
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("admin-nav-hash", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("admin-nav-hash", sync);
    };
  }, [pathname]);

  return (
    <nav aria-label="Navigasi dashboard admin" className="flex flex-col pb-4">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-1.5 pt-5 text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-white/40">
            {group.title}
          </p>

          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const ready = item.status === ADMIN_NAV_STATUS.ready;
              const active = ready && item.href ? isActiveHref(item.href, pathname, hash) : false;

              return (
                <li key={item.label}>
                  {ready && item.href ? (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      onNavigate={() => {
                        // Tautan anchor tidak memicu navigasi Next; sorotan
                        // menu harus diperbarui manual.
                        const next = typeof window === "undefined" ? "" : window.location.hash;
                        window.dispatchEvent(
                          new CustomEvent("admin-nav-hash", { detail: next }),
                        );
                      }}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex min-h-9 items-center gap-2.5 rounded-lg border-l-[3px] py-2 pl-2.5 pr-2.5 text-[13px] leading-5 no-underline transition-colors",
                        active
                          ? "border-ag-gold-base bg-white/15 font-semibold text-white"
                          : "border-transparent font-medium text-white/70 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        className={active ? "shrink-0 text-ag-gold-light" : "shrink-0 text-white/60"}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Belum termasuk rilis ini"
                      className="flex min-h-9 cursor-default items-center gap-2.5 rounded-lg border-l-[3px] border-transparent py-2 pl-2.5 pr-2.5 text-[13px] leading-5 text-white/45"
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <NavBadge tone={item.badgeTone}>{item.badge}</NavBadge>
                      ) : (
                        <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/60">
                          Segera
                        </span>
                      )}
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

function NavBadge({ tone = "warning", children }) {
  return (
    <span
      className={[
        "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-4",
        tone === "danger"
          ? "bg-red-500 text-white"
          : "bg-ag-gold-base text-ag-forest",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/**
 * Cocokkan `href` menu dengan lokasi sekarang. Menu dengan anchor hanya aktif
 * bila anchor-nya sama, sehingga "Dashboard" dan "Verifikasi Listing" tidak
 * menyala bersamaan.
 */
function isActiveHref(href, pathname, hash) {
  const [hrefPath, hrefHash] = href.split("#");
  const currentHash = (hash ?? "").replace(/^#/, "");
  if (hrefHash) return pathname === hrefPath && hrefHash === currentHash;
  if (hrefPath === "/dashboard/admin") return pathname === hrefPath && currentHash === "";
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

function AdminTopbar({ profile, logoutAction, menuOpen, onToggleMenu }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";

  return (
    <header
      id="admin-topbar"
      className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ag-line bg-white px-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] md:gap-4 md:px-6"
    >
      <button
        type="button"
        onClick={onToggleMenu}
        aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        aria-controls="admin-menu-drawer"
        aria-expanded={menuOpen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest lg:hidden"
      >
        <IconMenu />
      </button>

      <form
        role="search"
        action="/dashboard/admin"
        className="hidden min-w-0 flex-1 md:block md:max-w-md"
      >
        <div className="relative flex items-center">
          <IconSearch
            size={20}
            className="pointer-events-none absolute left-3 text-ag-slate-secondary"
          />
          <label htmlFor="admin-search" className="sr-only">
            Cari properti atau agen di antrean verifikasi
          </label>
          <input
            id="admin-search"
            name="q"
            type="search"
            defaultValue={searchQuery}
            placeholder="Cari properti atau agen di antrean..."
            className="h-10 w-full rounded-lg border border-transparent bg-ag-surface-low pl-10 pr-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted transition-colors focus:border-ag-gold-base focus:bg-white focus:outline-none"
          />
        </div>
      </form>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none md:gap-3">
        <a
          href="/dashboard/admin#antrean-verifikasi"
          aria-label="3 listing menunggu verifikasi"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest"
        >
          <IconBell size={20} />
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ag-booked ring-2 ring-white"
          />
        </a>

        <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-ag-line sm:block" />

        <ProfileMenu profile={profile} logoutAction={logoutAction} />
      </div>
    </header>
  );
}

function ProfileMenu({ profile, logoutAction }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointer(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="admin-profile-menu"
        aria-label={`Profil admin ${profile.fullName}`}
        className="flex items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-ag-surface-low"
      >
        <AgentAvatar
          agent={{ name: profile.fullName, avatarUrl: null }}
          size={32}
        />
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="max-w-[160px] truncate text-[12.5px] font-bold text-ag-slate">
            {profile.fullName}
          </span>
          <span className="text-[10.5px] text-ag-slate-muted">Administrator</span>
        </span>
        <IconChevronDown size={16} className="hidden text-ag-slate-muted sm:block" />
      </button>

      {open ? (
        <div
          id="admin-profile-menu"
          role="menu"
          aria-label="Menu profil admin"
          className="absolute right-0 z-40 mt-1.5 w-64 rounded-lg border border-ag-line bg-white p-1.5 shadow-lg"
        >
          <div className="border-b border-slate-100 px-2.5 pb-2.5 pt-1.5">
            <p className="truncate text-[13px] font-bold text-ag-slate">
              {profile.fullName}
            </p>
            <p className="truncate text-[11.5px] text-ag-slate-muted">{profile.email}</p>
            <p className="mt-1 text-[11px] text-ag-slate-muted">Administrator</p>
          </div>

          <Link
            href="/dashboard/admin"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-ag-slate hover:bg-ag-surface-low"
          >
            <IconHome size={16} className="text-ag-slate-muted" />
            Dashboard
          </Link>

          <Link
            href="/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-ag-slate hover:bg-ag-surface-low"
          >
            <IconArrowRight size={16} className="text-ag-slate-muted" />
            Buka situs publik
          </Link>

          <form action={logoutAction} className="mt-1 border-t border-slate-100 pt-1">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] font-semibold text-red-600 hover:bg-red-50"
            >
              <IconExit size={16} />
              Keluar
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function AdminDrawer({ open, onClose, profile, logoutAction }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a, button")?.focus();

    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled])',
      );
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
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        id="admin-menu-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : true}
        aria-label="Menu navigasi dashboard admin"
        className={`absolute inset-y-0 left-0 flex w-[min(85vw,17rem)] flex-col bg-ag-sidebar text-white shadow-xl transition-transform ${
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

        <SidebarContent
          profile={profile}
          logoutAction={logoutAction}
          onNavigate={onClose}
        />
      </div>
    </div>
  );
}
