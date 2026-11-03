import BeritaList from "@/components/site/BeritaList";
import { BERITA_UTAMA, PENAWARAN } from "@/lib/site/berita";

export const metadata = {
  title: "Berita",
  description:
    "Berita terbaru SANG Group Semarang: progres konstruksi, panduan GIS, legalitas SHM, dan program pembiayaan kawasan.",
};

/**
 * Halaman Berita (/berita).
 *
 * Sumber: docs/site/berita_sang_group_semarang/code.html — tiga section:
 * 1. Berita utama
 * 2. Grid berita + filter kategori
 * 3. Form penawaran eksklusif
 *
 * Navbar dan footer dipasang oleh layout grup (site), bukan di sini.
 */
export default function BeritaPage() {
  const inputClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 font-sans text-[12.5px] text-[#1b2a22] placeholder:text-gray-400 focus:border-[#c5a869] focus:outline-none focus:ring-[3px] focus:ring-[#c5a869]/15";

  return (
    <>
      {/* ============ 1. BERITA UTAMA ============ */}
      <section className="w-full bg-[#f5f5f2] px-6 pb-10 pt-16 lg:px-16 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
            {BERITA_UTAMA.title}
          </h1>

          <article className="mt-8 grid overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BERITA_UTAMA.image}
                alt={BERITA_UTAMA.alt}
                className="h-[260px] w-full object-cover lg:h-full lg:min-h-[320px]"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-9">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#b39556]">
                {BERITA_UTAMA.meta}
              </p>
              <h2 className="mt-3 font-sans text-2xl font-bold leading-snug tracking-tight text-[#0d3b2e] sm:text-3xl">
                {BERITA_UTAMA.headline}
              </h2>
              <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-600">
                {BERITA_UTAMA.excerpt}
              </p>
              <a
                href="/berita"
                className="mt-6 inline-flex w-fit items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#0d3b2e] no-underline transition-colors hover:text-[#c5a869]"
              >
                Baca Selengkapnya
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ============ 2. GRID BERITA + FILTER ============ */}
      <BeritaList />

      {/* ============ 3. PENAWARAN EKSKLUSIF ============ */}
      <section className="w-full bg-[#0d3b2e] px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-white md:text-3xl">
            {PENAWARAN.title}
          </h2>
          <p className="mt-2 font-sans text-[13px] text-white/65">{PENAWARAN.body}</p>

          <form className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PENAWARAN.fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`offer-${field.id}`}
                  className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-[#c5a869]"
                >
                  {field.label}
                </label>
                <input
                  id={`offer-${field.id}`}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#c5a869] px-7 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d3b2e] transition-colors hover:bg-[#d4af37]"
              >
                {PENAWARAN.submit}
              </button>
              <p className="mt-3 font-sans text-[9.5px] text-white/40">
                {PENAWARAN.privacy}
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
