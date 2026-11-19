import BrandMark from "@/components/layout/BrandMark";
import AccountNavLinks from "@/components/dashboard/AccountNavLinks";

/**
 * Kerangka dashboard ringkas untuk portal pembeli dan admin. Portal agen
 * memakai Navbar agen yang lebih lengkap; dua portal lain cukup header, menu
 * utama, dan area konten agar tidak menduplikasi sidebar.
 */
export default function AccountShell({
  portal,
  profile,
  nav = [],
  logoutAction,
  children,
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-cream text-brand-ink">
      <header className="bg-brand-deep text-brand-cream">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <BrandMark tone="light" />
            <span className="hidden border-l border-white/15 pl-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold sm:inline">
              {portal}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-[180px] truncate text-[12px] text-brand-cream/70 sm:inline">
              {profile.fullName}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-brand-cream transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>

        {nav.length > 0 ? (
          <nav aria-label="Navigasi dashboard" className="border-t border-white/10">
            <AccountNavLinks nav={nav} />
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">
        {children}
      </main>

      <footer className="border-t border-brand-line px-5 py-4 text-center text-[11px] text-muted">
        © 2026 SANG Group Semarang. Portal akun SANG Group.
      </footer>
    </div>
  );
}
