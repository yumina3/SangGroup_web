import { ABOUT, FEATURES, METRICS } from "@/lib/site/data";

/** Ikon garis untuk grid fitur Nature International Living. */
function FeatureIcon({ name }) {
  const paths = {
    pin: (
      <>
        <path d="M12 21c-4.5-5.5-7-8.5-7-12a7 7 0 0 1 14 0c0 3.5-2.5 6.5-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    send: <path d="M3 11l19-9-9 19-2-8-8-2z" />,
    leaf: (
      <>
        <path d="M4 20c8 0 14-5 15-15-9 1-15 6-15 15z" />
        <path d="M4 20c3-4 7-7 11-9" />
      </>
    ),
    drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
    pool: (
      <>
        <path d="M3 15c2 0 2-1.5 4-1.5S9 15 11 15s2-1.5 4-1.5S17 15 19 15" />
        <path d="M6 12V6a2 2 0 0 1 4 0v6" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    map: (
      <>
        <path d="M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3z" />
        <path d="M9 4v13M15 7v13" />
      </>
    ),
  };

  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {paths[name] ?? paths.pin}
    </svg>
  );
}

/**
 * Section 2: band hijau "Explore Sang Group Semarang".
 * Teks diambil dari section id="about" pada code.html.
 */
export function ExploreBand() {
  return (
    <section
      id="about"
      className="border-t border-[#144c3c] bg-[#0d3b2e] px-6 py-14 text-white lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {ABOUT.heading}
          </h2>
          <p className="mb-6 max-w-2xl font-sans text-xs font-light leading-relaxed text-gray-200 sm:text-sm">
            {ABOUT.body}
          </p>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#e6c875] no-underline transition-colors duration-200 hover:text-white"
          >
            Learn More
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mt-12 flex flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-10 font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-white/95 sm:gap-14 sm:text-[13px]">
            {ABOUT.pillars.map((pillar) => (
              <span
                key={pillar}
                className="cursor-pointer transition-colors hover:text-[#c5a869]"
              >
                {pillar}
              </span>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="flex items-center text-[#c5a869] opacity-90"
          >
            <svg
              className="h-5 w-5 fill-none stroke-current"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M2 18L8 8l5 7 4-5 3 8H2z" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Section 3: Nature International Living.
 *
 * Kartu potret dibuat menumpuk ke band hijau di atasnya lewat margin negatif
 * pada layar lebar, mengikuti code.html.
 */
export function NatureSection() {
  return (
    <section
      id="facilities"
      className="relative bg-[#faf8f5] px-6 pb-20 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="pt-10 lg:col-span-7 lg:pt-14">
            <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-[#0d3b2e] sm:text-5xl">
              {FEATURES.heading}
            </h2>
            <p className="mb-10 max-w-xl font-sans text-sm font-normal leading-relaxed text-gray-600 sm:text-base">
              {FEATURES.body}
            </p>

            <div className="grid grid-cols-1 gap-x-10 gap-y-6 font-sans text-[13px] font-medium text-gray-800 sm:grid-cols-2 sm:text-[14px]">
              {FEATURES.items.map((item) => (
                <div key={item.label} className="flex items-center space-x-3.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-[#0d3b2e]">
                    <FeatureIcon name={item.icon} />
                  </span>
                  <span className="leading-snug">{item.label}</span>
                </div>
              ))}
            </div>

            <a
              href="/fasilitas"
              className="mt-10 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#0d3b2e] no-underline transition-colors hover:text-[#c5a869]"
            >
              Eksplorasi Fasilitas Lengkap
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="relative lg:col-span-5 lg:-mt-24">
            <article className="relative overflow-hidden rounded-[26px] shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FEATURES.highlight.image}
                alt={FEATURES.highlight.alt}
                className="h-[340px] w-full object-cover sm:h-[420px]"
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#08231b] via-[#08231b]/55 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#e6c875]">
                  {FEATURES.highlight.eyebrow}
                </span>
                <h3 className="mt-2 font-sans text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {FEATURES.highlight.title}
                </h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-white/75">
                  {FEATURES.highlight.caption}
                </p>
              </div>
            </article>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-3 gap-4 border-y border-[#0d3b2e]/10 py-6">
          {METRICS.map((metric) => (
            <li key={metric.label} className="text-center">
              <p className="font-sans text-3xl font-bold tabular-nums text-[#0d3b2e] sm:text-4xl">
                {metric.value}
              </p>
              <p className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#718096]">
                {metric.label}
              </p>
            </li>
          ))}
        </ul>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.lifestyle.map((card) => (
            <li key={card.id}>
              <article className="group relative overflow-hidden rounded-lg transition-shadow duration-200 hover:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.label}
                  className="h-[180px] w-full object-cover"
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 font-sans text-[10px] font-medium text-white backdrop-blur-sm">
                  {card.label}
                </span>
              </article>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-2xl text-center font-sans text-[11px] leading-relaxed text-[#718096]">
          {FEATURES.caption}
        </p>
      </div>
    </section>
  );
}
