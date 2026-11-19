import Link from "next/link";

import FavoriteButton from "@/components/site/FavoriteButton";
import { formatDate, formatRupiah } from "@/lib/dashboard/format";
import { businessStatusMeta } from "@/lib/properties/labels";

/**
 * Kartu properti favorit untuk ringkasan akun dan halaman favorit.
 *
 * Semua data berasal dari `listFavoriteProperties`; gambar memakai foto
 * Storage bila tersedia, lalu jatuh ke aset portofolio saat objek belum
 * diunggah.
 */
export default function FavoritePropertyCard({
  property,
  viewer,
  fallbackImage,
}) {
  const status = businessStatusMeta(property.businessStatus);
  // Objek seed di Storage masih memakai placeholder kosong, sedangkan foto
  // portofolio statis sudah tersedia. Foto unggahan asli tetap diprioritaskan.
  const seedPlaceholder =
    typeof property.imageUrl === "string" &&
    /\/seed\/placeholder\.(png|jpe?g|webp)$/i.test(property.imageUrl);
  const image =
    property.imageUrl && !seedPlaceholder ? property.imageUrl : fallbackImage;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm transition-colors hover:border-brand-gold/60">
      <div className="relative h-44 shrink-0 bg-brand-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={property.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-md bg-brand-deep px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-brand-gold">
          {property.projectName}
        </span>
        <FavoriteButton
          propertyId={property.id}
          initialFavorite
          isAuthenticated={viewer.isAuthenticated}
          isBuyer={viewer.isBuyer}
          isActive={viewer.isActive}
          accountStatus={viewer.status}
          loginHref="/login"
          removeOnly
          compact
          className="absolute right-3 top-3 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[17px] font-bold tabular-nums text-brand-deep">
            {formatRupiah(property.price)}
          </p>
          <span
            className={`inline-flex rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset ${status.badge}`}
          >
            {status.label}
          </span>
        </div>

        <h3 className="mt-1.5 text-[14px] font-bold leading-snug text-brand-ink">
          {property.title}
        </h3>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          {property.categoryName} &middot; {property.address}
        </p>

        <dl className="mt-3 grid grid-cols-4 gap-2 border-y border-brand-line py-2.5 text-center">
          <div>
            <dt className="text-[8.5px] uppercase tracking-[0.04em] text-muted">
              L. Tanah
            </dt>
            <dd className="mt-0.5 text-[11.5px] font-bold tabular-nums text-brand-ink">
              {property.landArea ?? "—"} m&sup2;
            </dd>
          </div>
          <div>
            <dt className="text-[8.5px] uppercase tracking-[0.04em] text-muted">
              L. Bangunan
            </dt>
            <dd className="mt-0.5 text-[11.5px] font-bold tabular-nums text-brand-ink">
              {property.buildingArea ?? "—"} m&sup2;
            </dd>
          </div>
          <div>
            <dt className="text-[8.5px] uppercase tracking-[0.04em] text-muted">
              K. Tidur
            </dt>
            <dd className="mt-0.5 text-[11.5px] font-bold tabular-nums text-brand-ink">
              {property.bedrooms ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[8.5px] uppercase tracking-[0.04em] text-muted">
              K. Mandi
            </dt>
            <dd className="mt-0.5 text-[11.5px] font-bold tabular-nums text-brand-ink">
              {property.bathrooms ?? "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <p className="text-[10px] text-muted">
            Disimpan {formatDate(property.favoritedAt)}
          </p>
          <Link
            href="/sang-dipa#spesifikasi"
            className="inline-flex h-8 items-center justify-center rounded-md border border-brand-line px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:border-brand-gold"
          >
            Lihat Proyek
          </Link>
        </div>
      </div>
    </article>
  );
}
