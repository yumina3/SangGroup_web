import Link from "next/link";

import FavoritePropertyCard from "@/components/dashboard/buyer/FavoritePropertyCard";
import {
  IconArrowLeft,
  IconArrowRight,
  IconHeart,
} from "@/components/dashboard/icons";
import Alert from "@/components/ui/Alert";
import { requireRole } from "@/lib/auth/session";
import { listFavoriteProperties } from "@/lib/properties/catalog";
import { favoriteViewer } from "@/lib/properties/viewer";
import { PORTFOLIO } from "@/lib/site/data";

export const metadata = { title: "Favorit Saya" };

/** Halaman ini membaca sesi dan favorit pada setiap request. */
export const instant = false;

export default async function BuyerFavoritesPage() {
  const profile = await requireRole("buyer", "/dashboard/pembeli/favorit");
  const result = await listFavoriteProperties(profile.id);
  const properties = result.ok ? result.properties : [];
  const viewer = favoriteViewer(profile);
  const countLabel = result.ok ? properties.length : null;
  const gridClass =
    properties.length <= 2
      ? "grid gap-5 sm:grid-cols-2"
      : "grid gap-5 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-brand-line bg-white p-6 shadow-[0_4px_20px_-2px_rgba(13,59,46,0.05)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
              <IconHeart size={15} />
              Akun pembeli
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
              Properti Favorit
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
              Unit yang Anda simpan dari beranda atau halaman Sang Dipa.
              Termasuk unit yang sudah terjual, agar mudah dibandingkan dengan
              pilihan lain.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/dashboard/pembeli"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-brand-line px-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:border-brand-gold"
              >
                <IconArrowLeft size={14} />
                Ringkasan Akun
              </Link>
              <Link
                href="/sang-dipa#spesifikasi"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-brand-deep px-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
              >
                Jelajahi Properti
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-lg border border-brand-line bg-brand-cream/50 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-deep text-brand-gold">
              <IconHeart size={19} />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
                Total tersimpan
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-brand-deep">
                {countLabel ?? "—"} unit
              </p>
            </div>
          </div>
        </div>
      </section>

      {!result.ok ? (
        <Alert
          tone={result.code === "db_not_configured" ? "info" : "danger"}
          title={
            result.code === "db_not_configured"
              ? "Favorit belum tersambung"
              : "Favorit gagal dimuat"
          }
        >
          {result.code === "db_not_configured"
            ? "Database properti belum dikonfigurasi. Hubungi admin SANG Group untuk bantuan."
            : "Terjadi kendala saat memuat favorit Anda. Muat ulang halaman ini untuk mencoba lagi."}
        </Alert>
      ) : properties.length === 0 ? (
        <section className="rounded-xl border border-brand-line bg-white px-6 py-12 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-brand-deep ring-1 ring-brand-line">
            <IconHeart size={24} />
          </span>
          <h2 className="mt-4 text-[16px] font-bold text-brand-ink">
            Belum ada properti favorit
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed text-muted">
            Tekan ikon hati pada kartu properti di beranda atau halaman Sang
            Dipa. Anda perlu masuk sebagai pembeli untuk menyimpan favorit.
          </p>
          <Link
            href="/sang-dipa#spesifikasi"
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-deep px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
          >
            Jelajahi Properti
            <IconArrowRight size={15} />
          </Link>
        </section>
      ) : (
        <>
          <h2 className="sr-only">Daftar properti favorit</h2>
          <ul className={gridClass}>
            {properties.map((property, index) => (
              <li key={property.id} className="h-full">
                <FavoritePropertyCard
                  property={property}
                  viewer={viewer}
                  fallbackImage={
                    PORTFOLIO.items.dipa[index % PORTFOLIO.items.dipa.length]
                      .image
                  }
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
