"use client";

import { useState } from "react";

import { PORTFOLIO } from "@/lib/site/data";

/**
 * Section 5: portofolio kawasan hunian.
 *
 * Tab mengganti tiga kartu sekaligus. Hanya kawasan Sang Dipa yang punya
 * kartu detail di data; tab lain menampilkan kartu yang sama sampai data
 * kawasan tersebut diisi.
 */
export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState(PORTFOLIO.tabs[0].id);
  const cards = PORTFOLIO.items[activeTab] ?? PORTFOLIO.items.dipa;

  return (
    <section
      id="portfolio"
      className="bg-[#0d3b2e] px-6 py-20 font-sans text-white lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">
            {PORTFOLIO.eyebrow}
          </span>
          <h2 className="font-sans text-3xl font-bold tracking-tight text-white md:text-4xl">
            {PORTFOLIO.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs font-normal leading-relaxed text-emerald-100/80 sm:text-sm">
            {PORTFOLIO.body}
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Pilih kawasan"
            className="flex items-center gap-1 rounded-full border border-white/20 p-1.5"
          >
            {PORTFOLIO.tabs.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] transition-all sm:text-[11px] ${
                    selected
                      ? "bg-[#c5a059] text-[#0d3b2e]"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <li key={card.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#c5a869]/30 bg-white text-gray-800 shadow-[0_4px_20px_-2px_rgba(13,59,46,0.25)] transition-transform duration-200 hover:-translate-y-1">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="h-[190px] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-[#c5a869] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#0d3b2e]">
                    {card.badge}
                  </span>
                  <span className="absolute right-3 top-3 rounded-md bg-[#0d3b2e] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.04em] text-[#e6c875]">
                    {card.price}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#c5a869]">
                    {card.cluster}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-gray-400">
                    {card.size}
                  </p>
                  <h3 className="mt-2 font-sans text-[19px] font-bold leading-snug text-[#0d3b2e]">
                    {card.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[11.5px] leading-relaxed text-gray-500">
                    {card.description}
                  </p>

                  <dl className="mt-4 grid grid-cols-4 gap-1 border-t border-gray-100 pt-3">
                    {card.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className="text-[8.5px] uppercase tracking-[0.04em] text-gray-400">
                          {spec.label}
                        </dt>
                        <dd className="mt-0.5 text-[12px] font-bold tabular-nums text-[#0d3b2e]">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <a
                    href={PORTFOLIO.detailHref}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#0d3b2e] text-[10px] font-bold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:bg-[#134e3f]"
                  >
                    {PORTFOLIO.cta}
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
