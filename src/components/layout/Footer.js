import Link from "next/link";

import BrandMark from "@/components/layout/BrandMark";

/**
 * Footer situs publik. Dipakai layout publik; dashboard memakai shell sendiri.
 */
export default function Footer() {
  return (
    <footer className="relative mt-auto bg-brand text-brand-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-gold/45"
      />

      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <BrandMark tone="light" />
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-brand-cream/60">
            Eco-luxury residence di Candisari, Tembalang, dan Sambiroto,
            Semarang. Hunian modern dengan ruang terbuka hijau.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-brand-gold">
            Semarang, Indonesia
          </p>
        </div>

        <nav aria-label="Tautan perumahan">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Perumahan
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[13px] text-brand-cream/65">
            <li>Sang Dipa — Candisari</li>
            <li>Sang Wira — Tembalang</li>
            <li>Sang Naya — Sambiroto</li>
          </ul>
        </nav>

        <nav aria-label="Tautan informasi">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Informasi
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[13px] text-brand-cream/65">
            <li>Fasilitas</li>
            <li>Lokasi</li>
            <li>Berita</li>
            <li>Kontak</li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Akun
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[13px] text-brand-cream/65">
            <li>
              <Link href="/login" className="no-underline hover:text-brand-cream">
                Masuk
              </Link>
            </li>
            <li>
              <Link href="/register" className="no-underline hover:text-brand-cream">
                Daftar pembeli
              </Link>
            </li>
            <li>
              <Link
                href="/pasang-properti"
                className="no-underline hover:text-brand-cream"
              >
                Daftar agen
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-cream/12">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-[11px] tracking-wide text-brand-cream/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Sang Group. Data pada situs ini adalah data simulasi.</p>
          <p>Kontak resmi menyusul konfirmasi Sang Group.</p>
        </div>
      </div>
    </footer>
  );
}
