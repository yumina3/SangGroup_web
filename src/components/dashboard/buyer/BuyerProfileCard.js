import Link from "next/link";

import {
  IconArrowRight,
  IconCalendar,
  IconCheckCircle,
  IconMail,
  IconPhone,
} from "@/components/dashboard/icons";
import { formatDate, initialsOf } from "@/lib/dashboard/format";

function phoneHref(phone) {
  const digits = String(phone ?? "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

function displayPhone(phone) {
  const value = String(phone ?? "").trim();
  const digits = value.replace(/\D/g, "");

  if (digits.length < 9 || !digits.startsWith("62")) return value;

  const local = digits.slice(2);
  return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`;
}

/**
 * Kartu identitas pembeli mengikuti header akun pada desain reference:
 * avatar, kontak, status, ringkasan pengajuan, dan aksi utama.
 *
 * Foto profil belum disimpan di tabel `profiles`, jadi avatar memakai inisial
 * agar tidak menampilkan foto contoh yang bukan milik pembeli.
 */
export default function BuyerProfileCard({ profile, stats = [] }) {
  const name = profile.fullName || "Pembeli SANG Group";
  const tel = phoneHref(profile.phone);

  return (
    <section className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-[0_4px_20px_-2px_rgba(13,59,46,0.05)]">
      <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative w-20 shrink-0 sm:w-24">
            <div
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-lg bg-brand-deep text-2xl font-semibold tracking-wide text-brand-gold ring-1 ring-brand-deep sm:h-24 sm:w-24 sm:text-3xl"
            >
              {initialsOf(name)}
            </div>
            <span
              title="Akun aktif"
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-md border border-white bg-brand-deep text-brand-gold shadow-sm"
            >
              <IconCheckCircle size={16} />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-success">
                <IconCheckCircle size={13} />
                Akun aktif
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-w-0 items-center gap-1.5 text-muted no-underline transition-colors hover:text-brand-deep"
                >
                  <IconMail size={15} className="shrink-0 text-brand-gold" />
                  <span className="break-all">{profile.email}</span>
                </a>
              ) : null}

              {profile.phone ? (
                tel ? (
                  <a
                    href={tel}
                    className="inline-flex items-center gap-1.5 text-muted no-underline transition-colors hover:text-brand-deep"
                  >
                    <IconPhone size={15} className="shrink-0 text-brand-gold" />
                    {displayPhone(profile.phone)}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <IconPhone size={15} className="shrink-0 text-brand-gold" />
                    {displayPhone(profile.phone)}
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <IconPhone size={15} className="shrink-0 text-brand-gold" />
                  Nomor belum diisi
                </span>
              )}

              {profile.createdAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <IconCalendar
                    size={15}
                    className="shrink-0 text-brand-gold"
                  />
                  Member sejak {formatDate(profile.createdAt)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-brand-line pt-5 lg:items-end lg:border-t-0 lg:pl-6 lg:pt-0">
          {stats.length > 0 ? (
            <dl className="flex flex-wrap gap-2">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="flex min-w-[104px] flex-1 items-center gap-2.5 rounded-md border border-brand-line bg-brand-cream/50 px-3 py-2"
                  >
                    {Icon ? (
                      <Icon size={16} className="shrink-0 text-brand-gold" />
                    ) : null}
                    <div>
                      <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                        {stat.label}
                      </dt>
                      <dd className="text-[13px] font-bold tabular-nums text-brand-deep">
                        {stat.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Link
              href="/sang-dipa#spesifikasi"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-deep px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
            >
              Jelajahi Properti
              <IconArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard/pembeli/favorit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-line px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:border-brand-gold"
            >
              Lihat Favorit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
