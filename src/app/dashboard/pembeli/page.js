import Link from "next/link";

import BuyerProfileCard from "@/components/dashboard/buyer/BuyerProfileCard";
import BuyerTrackingCards from "@/components/dashboard/buyer/BuyerTrackingCards";
import FavoritePropertyCard from "@/components/dashboard/buyer/FavoritePropertyCard";
import {
  IconArrowRight,
  IconHeart,
  IconMessage,
  IconUsers,
} from "@/components/dashboard/icons";
import Alert from "@/components/ui/Alert";
import { requireRole } from "@/lib/auth/session";
import { isActiveInquiry } from "@/lib/dashboard/inquiry-status";
import { listBuyerInquiries } from "@/lib/properties/inquiries";
import { listFavoriteProperties } from "@/lib/properties/catalog";
import { favoriteViewer } from "@/lib/properties/viewer";
import { PORTFOLIO } from "@/lib/site/data";

export const metadata = { title: "Ringkasan Akun" };

/** Halaman ini membaca sesi, favorit, dan pengajuan pada setiap request. */
export const instant = false;

function FavoriteEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-brand-line bg-brand-cream/40 px-6 py-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-deep ring-1 ring-brand-line">
        <IconHeart size={20} />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-brand-ink">
        Belum ada properti favorit
      </p>
      <p className="mx-auto mt-1 max-w-md text-[12.5px] leading-relaxed text-muted">
        Tekan ikon hati pada kartu properti di beranda atau halaman Sang Dipa.
        Properti yang Anda simpan akan tampil di sini.
      </p>
      <Link
        href="/sang-dipa#spesifikasi"
        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-deep px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
      >
        Jelajahi Properti
        <IconArrowRight size={15} />
      </Link>
    </div>
  );
}

export default async function BuyerDashboardPage() {
  const profile = await requireRole("buyer", "/dashboard/pembeli");
  const [favoriteResult, inquiryResult] = await Promise.all([
    listFavoriteProperties(profile.id),
    listBuyerInquiries(profile.id),
  ]);
  const properties = favoriteResult.ok ? favoriteResult.properties : [];
  const inquiries = inquiryResult.ok ? inquiryResult.inquiries : [];
  const visitInquiries = inquiries.filter((item) => item.type === "kunjungan");
  const viewer = favoriteViewer(profile);
  const favoriteLabel = favoriteResult.ok ? properties.length : null;
  const visitLabel = inquiryResult.ok ? visitInquiries.length : null;
  const activeCount = inquiries.filter((item) =>
    isActiveInquiry(item.status),
  ).length;
  const stats = [
    { label: "Kunjungan", value: visitLabel ?? "—", icon: IconUsers },
    { label: "Favorit", value: favoriteLabel ?? "—", icon: IconHeart },
    {
      label: "Pengajuan aktif",
      value: inquiryResult.ok ? activeCount : "—",
      icon: IconMessage,
    },
  ];
  const previewGrid =
    properties.length <= 2
      ? "grid gap-4 sm:grid-cols-2"
      : properties.length === 3
        ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

  return (
    <div className="space-y-6">
      <BuyerProfileCard profile={profile} stats={stats} />

      <BuyerTrackingCards inquiries={inquiries} />

      <section
        id="favorit"
        aria-labelledby="judul-favorit"
        className="scroll-mt-6 rounded-xl border border-brand-line bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-brand-line pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
              <IconHeart size={15} />
              Properti favorit Anda
            </p>
            <h2
              id="judul-favorit"
              className="mt-1.5 text-xl font-bold tracking-tight text-brand-ink sm:text-2xl"
            >
              Koleksi Properti Tersimpan (
              <span className="whitespace-nowrap">
                {favoriteLabel ?? "—"} unit
              </span>
              )
            </h2>
          </div>
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <p className="max-w-xs text-[12px] leading-relaxed text-muted lg:text-right">
              Bandingkan spesifikasi dan ketersediaan unit pilihan Anda.
            </p>
            {properties.length > 0 ? (
              <Link
                href="/dashboard/pembeli/favorit"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:text-brand-gold"
              >
                Kelola semua favorit
                <IconArrowRight size={13} />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          {!favoriteResult.ok ? (
            <Alert
              tone={
                favoriteResult.code === "db_not_configured" ? "info" : "danger"
              }
              title={
                favoriteResult.code === "db_not_configured"
                  ? "Favorit belum tersambung"
                  : "Favorit gagal dimuat"
              }
            >
              {favoriteResult.code === "db_not_configured"
                ? "Database properti belum dikonfigurasi. Hubungi admin SANG Group untuk bantuan."
                : "Terjadi kendala saat memuat favorit Anda. Muat ulang halaman ini untuk mencoba lagi."}
            </Alert>
          ) : properties.length === 0 ? (
            <FavoriteEmptyState />
          ) : (
            <ul className={previewGrid}>
              {properties.slice(0, 4).map((property, index) => (
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
          )}
        </div>
      </section>

    </div>
  );
}
