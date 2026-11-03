import { BRAND, HERO, ABOUT } from "@/lib/site/data";

/**
 * Section 1 + 2: hero beranda.
 *
 * Mengikuti docs/site/beranda.../code.html: foto penuh dengan dua overlay
 * gradasi, wordmark kanan atas, judul rata kanan, dan strip info bawah.
 */
export default function HeroSite() {
  return (
    <section
      className="relative flex h-[620px] w-full flex-col justify-between overflow-hidden bg-[#08231B] lg:h-[720px]"
      aria-label="Sorotan kawasan"
    >
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO.image}
          alt={HERO.alt}
          className="h-full w-full object-cover object-center brightness-95"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-[#08231B]/90 via-[#08231B]/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#08231B]/95 via-transparent to-black/30"
        />
      </div>

      {/* Wordmark kanan atas */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-end px-6 pt-8 lg:px-16">
        <div className="text-right">
          <div className="font-serif text-2xl font-bold italic leading-none tracking-tight text-site-gold lg:text-3xl">
            Sang Group
          </div>
          <div className="mt-0.5 font-sans text-[8px] font-medium uppercase tracking-[0.25em] text-white/90">
            Residential &amp; Lifestyle Community
          </div>
        </div>
      </div>

      {/* Judul utama */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-7xl justify-end px-6 lg:px-16">
        <div className="max-w-xl text-right">
          <h1 className="mb-3 font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {HERO.title}
            <br />
            <span className="font-serif font-normal italic text-site-gold">
              {HERO.titleAccent}
            </span>
          </h1>
          <p className="ml-auto mt-4 max-w-md font-sans text-xs font-normal leading-relaxed text-gray-100 drop-shadow-sm sm:text-sm">
            {HERO.body}
          </p>
        </div>
      </div>

      {/* Strip info bawah */}
      <div className="relative z-10 w-full bg-black/45 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 lg:px-16">
          <p className="font-sans text-[11px] text-white/80">
            Untuk Informasi Detail
            <span className="mx-2 text-white/35">|</span>
            <span aria-hidden="true">🌐 </span>
            {BRAND.site}
            <span className="mx-2 text-white/35">|</span>
            <span aria-hidden="true">📞 </span>
            {BRAND.phone}
          </p>
          <div className="flex items-center gap-1.5" aria-label="Indikator slide">
            <span aria-hidden="true" className="h-[2px] w-8 bg-site-gold" />
            <span aria-hidden="true" className="h-[2px] w-5 bg-white/30" />
          </div>
        </div>
      </div>

      <span className="sr-only">{ABOUT.heading}</span>
    </section>
  );
}
