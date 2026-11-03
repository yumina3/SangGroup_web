import { ABOUT_HERO, JOURNEY, TEAM, VISION_MISSION } from "@/lib/site/about";

export const metadata = {
  title: "Tentang Kami",
  description:
    "SANG Group membangun kawasan residensial perbukitan terpadu di Semarang dengan presisi geospasial dan legalitas SHM BPN.",
};

/**
 * Halaman Tentang Kami (/about).
 *
 * Sumber: docs/site/tentang_kami_sang_group_semarang/code.html — empat section:
 *   1. Hero gradien + tiga kartu pilar (3 Kawasan / 100% SHM / 40% RTH)
 *   2. Visi & Misi dalam satu kartu terbelah dua
 *   3. Perjalanan (timeline foto lingkaran bertumpuk)
 *   4. Tim pakar (deretan kartu potret)
 *
 * Navbar dan footer dipasang oleh layout grup (site), bukan di sini.
 */
export default function AboutPage() {
  return (
    <>
      {/* ============ 1. HERO ============ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0D3B2E] via-[#0B3126] to-[#09281F] py-20 text-white lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(197,168,89,0.55), transparent 45%), radial-gradient(circle at 80% 70%, rgba(197,168,89,0.35), transparent 40%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h1 className="mb-6 font-sans text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[52px]">
              {ABOUT_HERO.title}
            </h1>
            <p className="mx-auto max-w-3xl font-sans text-base font-light leading-relaxed text-stone-300 md:text-lg">
              {ABOUT_HERO.body}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {ABOUT_HERO.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="flex flex-col justify-between border border-[#c5a869]/30 bg-[#09281F]/90 p-8 shadow-xl backdrop-blur-sm"
              >
                <div>
                  <div className="mb-3 font-sans text-4xl font-extrabold tracking-tight text-[#c5a869] lg:text-5xl">
                    {pillar.stat}
                  </div>
                  <span className="mb-3 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    {pillar.statLabel}
                  </span>
                  <p className="font-sans text-sm font-light leading-relaxed text-stone-300">
                    {pillar.body}
                  </p>
                </div>
                <p className="mt-6 border-t border-white/10 pt-4 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#c5a869]">
                  {pillar.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 2. VISI & MISI ============ */}
      <section className="w-full border-b border-stone-200/60 bg-[#fdfbf7] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 overflow-hidden border border-stone-200 shadow-xl md:grid-cols-2">
            {/* Visi */}
            <div className="flex flex-col justify-center bg-white p-8 md:p-12 lg:p-16">
              <span className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#c5a869]">
                {VISION_MISSION.eyebrow}
              </span>
              <h3 className="mb-3 font-sans text-2xl font-bold leading-snug tracking-tight text-[#0d3b2e] md:text-3xl lg:text-[32px]">
                {VISION_MISSION.vision.title}
              </h3>
              <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#c5a869]">
                {VISION_MISSION.vision.subtitle}
              </p>
              <p className="font-sans text-sm leading-relaxed text-stone-600">
                {VISION_MISSION.vision.body}
              </p>
              <p className="mt-4 font-sans text-sm leading-relaxed text-stone-500">
                {VISION_MISSION.vision.extra}
              </p>

              <a
                href="/sang-dipa"
                className="mt-8 inline-flex w-fit items-center gap-1.5 bg-[#0d3b2e] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-white no-underline transition-colors hover:bg-[#09281f]"
              >
                {VISION_MISSION.ctaPrimary}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Misi */}
            <div className="order-2 flex flex-col justify-center border-t border-stone-200 bg-white p-8 md:order-1 md:border-t-0 md:border-l md:p-12 lg:p-16">
              <span className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#c5a869]">
                {VISION_MISSION.mission.subtitle}
              </span>
              <h3 className="mb-3 font-sans text-2xl font-bold leading-snug tracking-tight text-[#0d3b2e] md:text-3xl lg:text-[32px]">
                {VISION_MISSION.mission.title}
              </h3>
              <p className="mb-5 font-sans text-sm leading-relaxed text-stone-500">
                {VISION_MISSION.mission.intro}
              </p>

              <ul className="flex flex-col gap-4">
                {VISION_MISSION.mission.items.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 font-sans text-sm text-[#c5a869]"
                    >
                      ◈
                    </span>
                    <span className="font-sans text-sm leading-relaxed text-stone-600">
                      <span className="font-bold text-[#0d3b2e]">{item.title}:</span>{" "}
                      {item.body}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/kontak"
                className="mt-8 inline-flex w-fit items-center gap-1.5 border border-[#c5a869] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d3b2e] no-underline transition-colors hover:bg-[#c5a869]"
              >
                {VISION_MISSION.ctaSecondary}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. PERJALANAN ============ */}
      <section className="w-full overflow-hidden bg-[#faf8f3] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#c5a869]">
                {JOURNEY.eyebrow}
              </span>
              <h2 className="mb-6 font-sans text-3xl font-bold leading-tight tracking-tight text-[#0d3b2e] md:text-4xl">
                {JOURNEY.heading}
              </h2>
              <p className="mb-4 font-sans text-sm leading-relaxed text-stone-600">
                {JOURNEY.intro}
              </p>
              <p className="font-sans text-sm leading-relaxed text-stone-500">
                {JOURNEY.intro2}
              </p>
            </div>

            <div className="lg:col-span-7">
              <ol className="relative flex flex-col gap-10">
                {JOURNEY.milestones.map((item) => (
                  <li key={item.year} className="flex items-start gap-4">
                    {/* Foto lingkaran bertumpuk */}
                    <div className="relative flex w-[340px] shrink-0 items-center justify-center sm:w-[420px] md:w-[460px]">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-[#c5a869]/10 blur-2xl"
                      />
                      <div className="relative z-10 h-48 w-48 overflow-hidden rounded-full border-4 border-[#c5a869] bg-[#0d3b2e] shadow-2xl transition-transform duration-500 hover:scale-105 sm:h-60 sm:w-60 md:h-64 md:w-64">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="h-full w-full object-cover brightness-95 contrast-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d3b2e]/60 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-0 right-0 text-center">
                          <span className="rounded-full border border-[#c5a869]/40 bg-[#0d3b2e]/90 px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest text-[#c5a869]">
                            {item.year}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#c5a869]">
                        {item.tag}
                      </p>
                      <h3 className="mt-2 font-sans text-lg font-bold leading-snug text-[#0d3b2e]">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-sm font-sans text-[13px] leading-relaxed text-stone-600">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. TIM PAKAR ============ */}
      <section className="relative w-full overflow-hidden bg-[#0d3b2e] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#c5a869]">
                {TEAM.eyebrow}
              </span>
              <h2 className="font-sans text-2xl font-bold uppercase tracking-[0.06em] text-white md:text-3xl">
                {TEAM.heading}
              </h2>
            </div>
            <p className="max-w-md font-sans text-sm leading-relaxed text-stone-300">
              {TEAM.body}
            </p>
          </div>

          <ul className="mx-auto flex max-w-6xl flex-wrap items-end justify-center gap-5 py-8 lg:flex-nowrap">
            {TEAM.members.map((member, index) => {
              const featured = index === 2;
              return (
                <li
                  key={member.name}
                  className={`group relative flex h-[440px] w-[260px] shrink-0 flex-col overflow-hidden rounded-[32px] border bg-[#09281F] shadow-2xl transition-all duration-500 hover:-translate-y-3 ${
                    featured
                      ? "z-20 h-[480px] w-[270px] border-2 border-[#c5a869] sm:w-[280px] lg:w-[235px]"
                      : "border-[#c5a869]/40 hover:border-[#c5a869] sm:w-[270px] lg:w-[220px]"
                  }`}
                >
                  <div className="relative h-[310px] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.alt}
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09281F] via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col justify-end p-5">
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#c5a869]">
                      {member.category}
                    </span>
                    <h3 className="mt-1.5 font-sans text-[13px] font-bold leading-snug text-white">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-sans text-[11px] text-stone-400">
                      {member.role}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 flex justify-center">
            <a
              href="/kontak"
              className="inline-flex items-center justify-center gap-2 border border-[#c5a869] bg-[#c5a869] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#09281F] no-underline transition-colors hover:bg-[#d4af37]"
            >
              {TEAM.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
