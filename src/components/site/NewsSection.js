import { NEWS } from "@/lib/site/data";

/**
 * Section 7: berita & insight.
 * Kartu memakai hijau sedikit lebih terang dari band agar terpisah.
 */
export default function NewsSection() {
  return (
    <section id="news" className="bg-[#0d3b2e] px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#c5a059]">
              {NEWS.eyebrow}
            </span>
            <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              {NEWS.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-white/70 md:text-sm">
            {NEWS.body}
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {NEWS.items.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-xl bg-[#134e3f] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.45)]">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-[160px] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-[#c5a869] px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em] text-[#0d3b2e]">
                    {item.chip}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-white/45">
                    {item.meta}
                  </p>
                  <h3 className="mt-2 font-sans text-[18px] font-bold leading-snug text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 font-sans text-[11.5px] leading-relaxed text-white/60">
                    {item.excerpt}
                  </p>
                  <a
                    href={NEWS.detailHref}
                    className="mt-4 inline-flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#e6c875] no-underline transition-colors hover:text-white"
                  >
                    {NEWS.cta}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
