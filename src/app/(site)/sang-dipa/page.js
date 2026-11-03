import { AMBIENCE, DIPA_HERO, GALERI, SPESIFIKASI } from "@/lib/site/sang-dipa";

export const metadata = {
  title: "Sang Dipa Residence",
  description:
    "Sang Dipa Residence di perbukitan Candisari: hunian tropis kontemporer dengan legalitas SHM, taman 40%, dan clubhouse eksklusif.",
};

/**
 * Halaman Sang Dipa (/sang-dipa) — "Products".
 *
 * Sumber: docs/site/sang_dipa_proyek_residensial_property_kita/code.html —
 * enam section: hero, ambience, taman, clubhouse, spesifikasi, galeri.
 *
 * Navbar dan footer dipasang oleh layout grup (site), bukan di sini.
 */
export default function SangDipaPage() {
  return (
    <>
      {/* ============ 1. HERO ============ */}
      <section className="relative w-full overflow-hidden bg-[#08231b]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DIPA_HERO.image}
            alt={DIPA_HERO.alt}
            className="h-full w-full object-cover brightness-[0.55]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#08231b]/95 via-[#08231b]/70 to-[#08231b]/25"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-16 lg:py-32">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#c5a869]">
            {DIPA_HERO.eyebrow}
          </span>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            {DIPA_HERO.title}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-white/75">
            {DIPA_HERO.body}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {DIPA_HERO.badges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-sans text-[10px] font-medium text-white backdrop-blur-sm"
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 2-4. AMBIENCE / TAMAN / CLUBHOUSE ============ */}
      {AMBIENCE.map((item, index) => {
        const reversed = index % 2 === 1;
        return (
          <section
            key={item.id}
            id={item.id}
            className={`w-full px-6 py-20 lg:px-16 ${
              reversed ? "bg-[#f5f5f2]" : "bg-[#faf8f5]"
            }`}
          >
            <div className="mx-auto max-w-7xl">
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
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
                  {item.zone ? (
                    <span className="absolute left-4 top-4 rounded-md bg-[#0d3b2e]/90 px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.1em] text-[#e6c875]">
                      {item.zone}
                    </span>
                  ) : null}
                </div>

                <div>
                  <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#b39556]">
                    {item.eyebrow}
                  </span>
                  <h2 className="mt-3 font-sans text-3xl font-bold leading-tight tracking-tight text-[#0d3b2e] md:text-4xl">
                    {item.title}
                  </h2>
                  <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-600">
                    {item.body}
                  </p>

                  {item.caption ? (
                    <p className="mt-4 font-sans text-base italic text-[#0d3b2e]">
                      {item.caption}
                    </p>
                  ) : null}
                  {item.note ? (
                    <p className="mt-1 font-sans text-[11.5px] text-gray-500">
                      {item.note}
                    </p>
                  ) : null}

                  {item.features.length > 0 ? (
                    <ul
                      className={`mt-6 grid gap-3 ${
                        item.features.length > 3 ? "sm:grid-cols-2" : "sm:grid-cols-3"
                      }`}
                    >
                      {item.features.map((feature) => (
                        <li
                          key={feature.title}
                          className="rounded-lg border border-[#0d3b2e]/10 bg-white px-3 py-2.5"
                        >
                          <p className="font-sans text-[11.5px] font-bold text-[#0d3b2e]">
                            {feature.title}
                          </p>
                          {feature.body ? (
                            <p className="mt-0.5 font-sans text-[10px] text-gray-500">
                              {feature.body}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ============ 5. SPESIFIKASI ============ */}
      <section id="spesifikasi" className="w-full bg-[#0d3b2e] px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#c5a869]">
            {SPESIFIKASI.eyebrow}
          </span>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Material */}
            <div>
              <h2 className="font-sans text-2xl font-bold tracking-tight text-white md:text-3xl">
                {SPESIFIKASI.titleMaterial}
              </h2>
              <dl className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {SPESIFIKASI.materials.map((material) => (
                  <div
                    key={material.no}
                    className="flex items-start justify-between gap-4 py-2.5"
                  >
                    <dt className="font-sans text-[11px] text-white/50">
                      <span className="mr-2 font-bold text-[#c5a869]">
                        {material.no}.
                      </span>
                      {material.label}
                    </dt>
                    <dd className="text-right font-sans text-[11.5px] font-semibold text-white">
                      {material.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Tipe hunian */}
            <div>
              <h2 className="font-sans text-2xl font-bold tracking-tight text-white md:text-3xl">
                {SPESIFIKASI.titleTypes}
              </h2>
              <p className="mt-3 font-sans text-[12.5px] leading-relaxed text-white/60">
                {SPESIFIKASI.intro}
              </p>

              <ul className="mt-6 flex flex-col gap-4">
                {SPESIFIKASI.types.map((type) => (
                  <li key={type.id}>
                    <article className="overflow-hidden rounded-xl bg-white">
                      <div className="flex items-stretch">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={type.image}
                          alt={type.alt}
                          className="h-[120px] w-[130px] shrink-0 object-cover"
                          loading="lazy"
                        />
                        <div className="flex flex-1 flex-col justify-center p-4">
                          <span className="font-sans text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#b39556]">
                            {type.label}
                          </span>
                          <h3 className="mt-1 font-sans text-[15px] font-bold text-[#0d3b2e]">
                            {type.name}
                          </h3>
                          <p className="mt-1 font-sans text-[10.5px] leading-snug text-gray-500">
                            {type.spec}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="font-sans text-[12px] font-bold tabular-nums text-[#0d3b2e]">
                              {type.price}
                            </span>
                            <a
                              href="#galeri"
                              className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[#b39556] no-underline hover:text-[#0d3b2e]"
                            >
                              Lihat Denah →
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-sans text-[9.5px] text-white/40">
                {SPESIFIKASI.footnote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. GALERI ============ */}
      <section id="galeri" className="w-full bg-[#f5f5f2] px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#b39556]">
            {GALERI.eyebrow}
          </span>
          <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-[#0d3b2e] md:text-3xl">
            {GALERI.title}
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GALERI.items.map((caption) => (
              <figure
                key={caption}
                className="group relative overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80`}
                  alt={caption}
                  className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                />
                <figcaption className="absolute bottom-3 left-3 right-3 font-sans text-[10.5px] font-medium text-white">
                  {caption}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Blueprint */}
          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-5 py-3">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#0d3b2e]">
                {GALERI.blueprint.label}
              </span>
              <span className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-gray-400">
                {GALERI.blueprint.scale} · {GALERI.blueprint.orientation}
              </span>
            </div>
            <ul className="grid sm:grid-cols-2">
              {GALERI.blueprint.floors.map((floor) => (
                <li
                  key={floor.name}
                  className="border-b border-gray-100 p-5 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-[13px] font-bold text-[#0d3b2e]">
                      {floor.name}
                    </span>
                    <span className="font-sans text-[10px] tabular-nums text-[#b39556]">
                      {floor.level}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[11.5px] text-gray-500">
                    {floor.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Show unit */}
          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-xl bg-[#0d3b2e] p-7 md:flex-row md:items-center">
            <div>
              <span className="font-sans text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#c5a869]">
                {GALERI.showUnit.tag}
              </span>
              <h3 className="mt-2 font-sans text-xl font-bold tracking-tight text-white md:text-2xl">
                {GALERI.showUnit.title}
              </h3>
              <p className="mt-2 max-w-xl font-sans text-[12px] leading-relaxed text-white/60">
                {GALERI.showUnit.body}
              </p>
            </div>
            <a
              href="/kontak"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-[#c5a869] px-6 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d3b2e] no-underline transition-colors hover:bg-[#d4af37]"
            >
              {GALERI.showUnit.cta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
