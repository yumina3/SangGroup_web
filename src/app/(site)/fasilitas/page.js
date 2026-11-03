import {
  FASILITAS_CTA,
  FASILITAS_HERO,
  FASILITAS_ITEMS,
  OLAHRAGA,
} from "@/lib/site/fasilitas";

export const metadata = {
  title: "Fasilitas",
  description:
    "Ekosistem fasilitas kawasan SANG Group: danau alami, klub olahraga, keamanan 24 jam, dan ruang terbuka hijau 40% di perbukitan Semarang.",
};

/**
 * Halaman Fasilitas (/fasilitas).
 *
 * Sumber: docs/site/fasilitas_sang_group_semarang/code.html — 11 section:
 * hero, 8 fasilitas berselang-seling, klub olahraga, dan CTA.
 *
 * Navbar dan footer dipasang oleh layout grup (site), bukan di sini.
 */
export default function FasilitasPage() {
  // Klub olahraga disisipkan setelah fasilitas ketiga (seperti code.html).
  const beforeSports = FASILITAS_ITEMS.slice(0, 2);
  const afterSports = FASILITAS_ITEMS.slice(2);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex h-[520px] w-full items-center overflow-hidden bg-[#08231b]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FASILITAS_HERO.image}
            alt={FASILITAS_HERO.alt}
            className="h-full w-full object-cover brightness-90"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#08231b]/95 via-[#08231b]/70 to-[#08231b]/30"
          />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-16">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#c5a869]">
            {FASILITAS_HERO.eyebrow}
          </span>
          <h1 className="mt-4 font-serif text-5xl font-bold text-white sm:text-6xl">
            {FASILITAS_HERO.title}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-sm font-light leading-relaxed text-stone-300">
            {FASILITAS_HERO.body}
          </p>
        </div>
      </section>

      {/* ============ DUA FASILITAS PERTAMA ============ */}
      {beforeSports.map((item, index) => (
        <FacilityBlock key={item.id} item={item} reversed={index % 2 === 1} />
      ))}

      {/* ============ KLUB OLAHRAGA ============ */}
      <section className="w-full bg-[#0d3b2e] px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#c5a869]">
              {OLAHRAGA.eyebrow}
            </span>
            <h2 className="mt-3 font-sans text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              {OLAHRAGA.title}
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-white/60">
              {OLAHRAGA.body}
            </p>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {OLAHRAGA.items.map((sport) => (
              <li key={sport.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl bg-[#134e3f] transition-transform duration-200 hover:-translate-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sport.image}
                    alt={sport.alt}
                    className="h-[160px] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#e6c875]">
                      {sport.tag}
                    </span>
                    <h3 className="mt-2 font-sans text-[15px] font-bold leading-snug text-white">
                      {sport.title}
                    </h3>
                    <p className="mt-2 font-sans text-[11.5px] leading-relaxed text-white/60">
                      {sport.body}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ FASILITAS SISANYA ============ */}
      {afterSports.map((item) => (
        <FacilityBlock
          key={item.id}
          item={item}
          reversed={Number(item.index) % 2 === 0}
        />
      ))}

      {/* ============ CTA ============ */}
      <section className="w-full border-t border-[#144c3c] bg-[#0d3b2e] px-6 py-20 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#c5a869]">
              {FASILITAS_CTA.eyebrow}
            </span>
            <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-white md:text-3xl">
              {FASILITAS_CTA.title}
            </h2>
            <p className="mt-3 max-w-xl font-sans text-[13px] leading-relaxed text-white/60">
              {FASILITAS_CTA.body}
            </p>
          </div>

          <a
            href="/kontak"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#c5a869] px-7 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d3b2e] no-underline transition-colors hover:bg-[#d4af37]"
          >
            Jadwalkan Tur Privat
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}

/**
 * Satu blok fasilitas: gambar di satu sisi, teks di sisi lain.
 * `reversed` membalik urutan agar section berselang-seling.
 */
function FacilityBlock({ item, reversed }) {
  const dark = item.tone === "dark";

  return (
    <section
      id={item.id}
      className={`w-full px-6 py-24 lg:px-16 ${
        dark ? "bg-[#0d3b2e]" : "bg-[#f8f6f0]"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
            reversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="relative overflow-hidden rounded-xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.alt}
              className="h-[300px] w-full object-cover sm:h-[380px]"
              loading="lazy"
            />
            <span className="absolute bottom-4 left-4 rounded-full border border-[#c5a869]/40 bg-[#08231b]/90 px-3 py-1 font-sans text-[10px] font-semibold text-[#e6c875] backdrop-blur-sm">
              {item.badge}
            </span>
          </div>

          <div>
            <span
              className={`block font-sans text-[10px] font-bold uppercase tracking-[0.22em] ${
                dark ? "text-[#c5a869]" : "text-[#b39556]"
              }`}
            >
              {item.index} / {item.category}
            </span>
            <h2
              className={`mt-3 font-sans text-3xl font-bold leading-tight tracking-tight md:text-4xl ${
                dark ? "text-white" : "text-[#0d3b2e]"
              }`}
            >
              {item.title}
            </h2>
            <p
              className={`mt-4 font-sans text-sm leading-relaxed ${
                dark ? "text-white/60" : "text-stone-600"
              }`}
            >
              {item.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
