"use client";

import { useState } from "react";

import { TOUR } from "@/lib/site/data";

/**
 * Section 4: tur virtual 360°.
 *
 * Tab di bawah viewer mengganti gambar. Hotspot emas tetap di tengah seperti
 * pada code.html.
 */
export default function TourSection() {
  const [activeId, setActiveId] = useState(TOUR.tabs[0].id);
  const active = TOUR.tabs.find((tab) => tab.id === activeId) ?? TOUR.tabs[0];

  return (
    <section className="bg-[#f1f6f3] px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-6 md:mb-10 md:flex-row md:items-start">
          <div className="max-w-xl">
            <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#c5a059]">
              {TOUR.eyebrow}
            </span>
            <h2 className="font-sans text-3xl font-bold leading-snug tracking-tight text-[#0d3b2e] md:text-4xl">
              {TOUR.heading}
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-sans text-xs leading-relaxed text-gray-500 md:text-sm">
              {TOUR.body}
            </p>
          </div>
        </div>

        <div
          className="group relative w-full select-none overflow-hidden rounded-[26px] border border-gray-200/90 bg-gray-900 shadow-2xl md:rounded-3xl"
          style={{ aspectRatio: "16 / 9", minHeight: "460px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.image}
            alt={active.alt}
            className="h-full w-full transform object-cover object-center brightness-95 transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
          />

          {/* HUD atas */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-5">
            <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-[#0d3b2e] shadow-lg backdrop-blur-md transition-shadow hover:shadow-xl">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-500 bg-amber-50 text-amber-600"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
                </svg>
              </span>
              <span className="text-xs font-bold tracking-tight text-gray-800 sm:text-sm">
                {active.badge}
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Buka layar penuh"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-gray-800 shadow-lg transition duration-200 hover:scale-105 hover:bg-white active:scale-95"
              >
                <svg
                  className="h-4 w-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hotspot tengah */}
          <div className="group/pin absolute left-[36%] top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span
                aria-hidden="true"
                className="absolute h-12 w-12 animate-ping rounded-full bg-[#e5c158]/40"
              />
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#e5c158] text-[#0d3b2e] shadow-2xl transition-all duration-200 hover:scale-110 hover:bg-[#d4af37] sm:h-10 sm:w-10">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
                </svg>
              </div>
            </div>
            <span className="mt-2 whitespace-nowrap rounded-full border border-white/20 bg-black/80 px-3 py-1 text-[11px] font-semibold text-white opacity-90 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover/pin:opacity-100">
              {TOUR.hotspot}
            </span>
          </div>

          {/* Tab bawah */}
          <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
            <div
              role="tablist"
              aria-label="Pilih lokasi tur"
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-[#0d3b2e]/95 p-1.5 shadow-2xl backdrop-blur-md"
            >
              {TOUR.tabs.map((tab) => {
                const selected = tab.id === active.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(tab.id)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs transition-all sm:px-5 ${
                      selected
                        ? "bg-[#c5a059] font-bold text-[#0d3b2e] shadow-md hover:bg-[#d4af37]"
                        : "font-medium text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Watermark kanan bawah */}
          <div className="pointer-events-none absolute bottom-5 right-6 z-20 hidden sm:block">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-[#0d3b2e] shadow-lg backdrop-blur-md">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 20c8 0 14-5 15-15-9 1-15 6-15 15z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
