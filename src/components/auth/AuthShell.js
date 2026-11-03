import BrandMark from "@/components/layout/BrandMark";

/**
 * Kerangka halaman auth: panel kiri hijau tua dengan aksen emas, panel kanan
 * berisi form. Gaya mengikuti situs publik pada board desain Sang Group
 * (garis emas tipis, sudut persegi, tanpa gradien).
 *
 * `footer` boleh fungsi (dipakai halaman yang butuh Suspense di bawah panel).
 */
export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  footerAbove = false,
}) {
  const footerNode =
    typeof footer === "function" ? footer() : footer;

  return (
    <main className="flex min-h-dvh flex-col bg-brand-cream lg:flex-row">
      <aside className="relative flex flex-col justify-between bg-brand px-8 py-10 text-brand-cream lg:w-[44%] lg:shrink-0 lg:px-14 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-brand-gold/70 lg:inset-x-14"
        />

        <div>
          <BrandMark tone="light" size="lg" />

          <p className="mt-10 max-w-sm text-[15px] leading-relaxed text-brand-cream/80">
            Eco-luxury residence di Candisari, Tembalang, dan Sambiroto. Satu
            sistem untuk properti, lokasi, dan calon pembeli.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-brand-cream/15 pt-6">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-brand-gold">
              Perumahan
            </dt>
            <dd className="mt-1 text-lg font-semibold text-brand-cream">3</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-brand-gold">
              Wilayah
            </dt>
            <dd className="mt-1 text-lg font-semibold text-brand-cream">Semarang</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-brand-gold">
              Klasifikasi
            </dt>
            <dd className="mt-1 text-lg font-semibold text-brand-cream">Premium</dd>
          </div>
        </dl>
      </aside>

      <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:py-16">
        <div className="w-full max-w-[430px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight text-brand-ink">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
          ) : null}

          {footerAbove && footerNode ? (
            <div className="mt-6">{footerNode}</div>
          ) : null}

          <div className="mt-7">{children}</div>

          {!footerAbove && footerNode ? (
            <div className="mt-6 border-t border-line pt-5 text-[13px] text-muted">
              {footerNode}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
