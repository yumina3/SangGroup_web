import PetaKawasan from "@/components/site/PetaKawasan";
import {
  JARAK,
  KEUNGGULAN,
  KUNJUNGAN,
  LOKASI_HERO,
  STRATEGIS,
} from "@/lib/site/lokasi";

export const metadata = {
  title: "Lokasi",
  description:
    "Lokasi kawasan SANG Group di Candisari Hills, Semarang: elevasi 160–335 mdpl, bebas banjir, dan 7 menit ke gerbang tol.",
};

/**
 * Halaman Lokasi (/lokasi).
 *
 * Sumber: docs/site/lokasi_sang_group_semarang/code.html — enam section:
 * hero, lokasi strategis, pemilih perumahan, keunggulan, jarak, kunjungan.
 *
 * Navbar dan footer dipasang oleh layout grup (site), bukan di sini.
 */
export default function LokasiPage() {
  return (
    <>
      {/* ============ 1. HERO ============ */}
      <section className="relative w-full overflow-hidden bg-[#0f4c3a]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, rgba(197,168,89,0.5), transparent 45%), radial-gradient(circle at 75% 75%, rgba(197,168,89,0.3), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-16 lg:py-24">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#e6c875]">
            {LOKASI_HERO.eyebrow}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            {LOKASI_HERO.title}
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-sm font-light leading-relaxed text-white/75">
            {LOKASI_HERO.body}
          </p>
        </div>
      </section>

      {/* ============ 2. LOKASI STRATEGIS ============ */}
      <section className="w-full bg-[#f5f5f2] px-6 py-16 lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
              {STRATEGIS.title}
            </h2>
            {STRATEGIS.paragraphs.map((text) => (
              <p
                key={text.slice(0, 24)}
                className="mt-4 font-sans text-[13px] leading-relaxed text-stone-600"
              >
                {text}
              </p>
            ))}
            <blockquote className="mt-6 border-l-2 border-[#c5a869] pl-4 font-sans text-lg italic text-[#0d3b2e]">
              “{STRATEGIS.quote}”
            </blockquote>
            <a
              href="#lokasi-sang-group"
              className="mt-6 inline-flex items-center gap-2 border border-[#0d3b2e] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d3b2e] no-underline transition-colors hover:bg-[#0d3b2e] hover:text-white"
            >
              {STRATEGIS.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="overflow-hidden rounded-xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STRATEGIS.image}
              alt={STRATEGIS.alt}
              className="h-[320px] w-full object-cover sm:h-[400px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ============ 3. PEMILIH PERUMAHAN ============ */}
      <PetaKawasan />

      {/* ============ 4. KEUNGGULAN ============ */}
      <section className="w-full bg-[#f5f5f2] px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#b39556]">
            {KEUNGGULAN.eyebrow}
          </span>
          <h2 className="mt-3 max-w-2xl font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
            {KEUNGGULAN.title}
          </h2>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {KEUNGGULAN.items.map((item) => (
              <li key={item.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-[170px] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-sans text-[15px] font-bold leading-snug text-[#0d3b2e]">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-[12px] leading-relaxed text-stone-600">
                      {item.body}
                    </p>
                    {item.extra ? (
                      <p className="mt-2 font-sans text-[12px] leading-relaxed text-stone-500">
                        {item.extra}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 5. JARAK ============ */}
      <section className="w-full bg-[#f5f5f2] px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
            {JARAK.title}
          </h2>
          <p className="mt-3 font-sans text-[13px] text-stone-500">{JARAK.body}</p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JARAK.items.map((item) => (
              <li
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-2xl font-extrabold tabular-nums text-[#0d3b2e]">
                    {item.distance}
                  </span>
                  <span className="font-sans text-[11px] font-semibold text-[#b39556]">
                    {item.time}
                  </span>
                </div>
                <p className="mt-2 font-sans text-[12px] leading-snug text-stone-600">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 6. KUNJUNGAN ============ */}
      <section className="relative w-full overflow-hidden bg-[#0f4c3a]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={KUNJUNGAN.image}
            alt={KUNJUNGAN.alt}
            className="h-full w-full object-cover brightness-75"
            loading="lazy"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0f4c3a]/95 via-[#0f4c3a]/70 to-transparent"
          />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-20 md:flex-row md:items-center lg:px-16">
          <div>
            <h2 className="font-sans text-3xl font-bold tracking-tight text-white md:text-4xl">
              {KUNJUNGAN.title}
            </h2>
            <p className="mt-3 max-w-lg font-sans text-[13px] leading-relaxed text-white/70">
              {KUNJUNGAN.body}
            </p>
          </div>
          <a
            href="/kontak"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#c5a869] px-7 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d3b2e] no-underline transition-colors hover:bg-[#d4af37]"
          >
            Jadwalkan Kunjungan
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
