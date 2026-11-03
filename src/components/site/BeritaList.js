"use client";

import { useState } from "react";

import { BERITA_FILTERS, BERITA_ITEMS } from "@/lib/site/berita";

/**
 * Section 2 halaman Berita: grid berita dengan filter kategori.
 *
 * Filter disimpan di state lokal. Saat data asli tersedia, filter sebaiknya
 * dipindah ke query string agar bisa dibagikan (PRD FR-PUB-04).
 */
export default function BeritaList() {
  const [active, setActive] = useState(BERITA_FILTERS[0]);

  const items =
    active === BERITA_FILTERS[0]
      ? BERITA_ITEMS
      : BERITA_ITEMS.filter((item) => item.category === active);

  return (
    <section className="w-full bg-[#f5f5f2] px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
          Berita
        </h2>

        <div
          role="tablist"
          aria-label="Filter kategori berita"
          className="mt-6 flex flex-wrap gap-2"
        >
          {BERITA_FILTERS.map((filter) => {
            const selected = filter === active;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(filter)}
                className={`rounded-full border px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  selected
                    ? "border-[#0d3b2e] bg-[#0d3b2e] text-white"
                    : "border-gray-300 text-gray-600 hover:border-[#0d3b2e] hover:text-[#0d3b2e]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
            <p className="font-sans text-[13px] text-gray-500">
              Belum ada berita pada kategori ini.
            </p>
            <button
              type="button"
              onClick={() => setActive(BERITA_FILTERS[0])}
              className="mt-4 inline-flex h-10 items-center rounded-md bg-[#0d3b2e] px-5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white"
            >
              Lihat semua berita
            </button>
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
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
                    <span className="w-fit rounded-md bg-[#c5a869] px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.08em] text-[#0d3b2e]">
                      {item.category}
                    </span>
                    <h3 className="mt-3 font-sans text-[15px] font-bold leading-snug text-[#0d3b2e]">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 font-sans text-[11.5px] leading-relaxed text-stone-600">
                      {item.excerpt}
                    </p>
                    <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.06em] text-gray-400">
                      {item.meta}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
