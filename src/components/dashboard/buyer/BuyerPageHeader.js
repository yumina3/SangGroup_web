import Link from "next/link";

import { IconArrowLeft, IconArrowRight } from "@/components/dashboard/icons";

/**
 * Kepala halaman sub-akun pembeli (jadwal, status minat, pesan, favorit).
 *
 * Menjaga semua subhalaman punya pola yang sama: label kecil emas, judul,
 * penjelasan singkat, dua aksi utama, dan kartu angka di sisi kanan.
 * Tidak memuat logika data agar tetap bisa dipakai sebagai Server Component.
 */
export default function BuyerPageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  counterLabel,
  counterValue,
  counterUnit = "",
  primary = { href: "/sang-dipa#spesifikasi", label: "Jelajahi Properti" },
}) {
  return (
    <section className="rounded-xl border border-brand-line bg-white p-6 shadow-[0_4px_20px_-2px_rgba(13,59,46,0.05)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            <Icon size={15} />
            {eyebrow}
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            {description}
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
              href={primary.href}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-brand-deep px-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
            >
              {primary.label}
              <IconArrowRight size={14} />
            </Link>
          </div>
        </div>

        {counterLabel ? (
          <div className="flex shrink-0 items-center gap-3 rounded-lg border border-brand-line bg-brand-cream/50 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-deep text-brand-gold">
              <Icon size={19} />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
                {counterLabel}
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-brand-deep">
                {counterValue}
                {counterUnit ? ` ${counterUnit}` : ""}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
