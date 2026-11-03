"use client";

import { useState } from "react";

import { PETA_KAWASAN } from "@/lib/site/lokasi";
/**
 * Section 3 halaman Lokasi: pemilih perumahan.
 *
 * Tab perumahan di atas, lalu panel dengan dua mode: "Peta" dan "360°".
 * Teks mengikuti docs/site/lokasi_sang_group_semarang/code.html.
 */
export default function PetaKawasan() {
  const [activeId, setActiveId] = useState(PETA_KAWASAN.items[0].id);
  const [mode, setMode] = useState(PETA_KAWASAN.modes[0].id);

  const active =
    PETA_KAWASAN.items.find((item) => item.id === activeId) ?? PETA_KAWASAN.items[0];
  const isPeta = mode === "peta";

  return (
    <section id="lokasi-sang-group" className="w-full pb-16 pt-8 text-[#1f2a26]">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <div className="text-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
            {PETA_KAWASAN.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-[12.5px] text-gray-500">
            {PETA_KAWASAN.hint}
          </p>
        </div>

        {/* Tab perumahan */}
        <div
          role="tablist"
          aria-label="Pilih perumahan"
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {PETA_KAWASAN.items.map((item) => {
            const selected = item.id === active.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(item.id)}
                className={`rounded-lg border px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  selected
                    ? "border-[#0d3b2e] bg-[#0d3b2e] text-white"
                    : "border-gray-300 text-gray-600 hover:border-[#0d3b2e] hover:text-[#0d3b2e]"
                }`}
              >
                {item.short}
              </button>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-xl">
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            {/* ---- Panel peta / 360° ---- */}
            <div className="relative min-h-[380px] bg-[#07231a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isPeta ? active.mapImage : active.panorama}
                alt={active.alt}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#07231a]/90 via-[#07231a]/30 to-transparent"
              />

              {/* Jarak */}
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 font-sans text-[10px] font-semibold text-[#0d3b2e] shadow-md backdrop-blur">
                {active.distance}
              </span>

              {/* Kompas 360° */}
              {!isPeta ? (
                <>
                  <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/50 px-3 py-1.5 font-sans text-[10px] font-bold tracking-[0.1em] text-white backdrop-blur">
                    {PETA_KAWASAN.direction}
                  </span>
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-sans text-[11px] text-white/70">
                    {PETA_KAWASAN.dragHint}
                  </span>
                </>
              ) : null}

              {/* Kontrol zoom */}
              <div className="absolute bottom-16 right-4 flex flex-col overflow-hidden rounded-md border border-white/20">
                <button
                  type="button"
                  aria-label="Perbesar peta"
                  className="h-8 w-8 bg-white/95 font-sans text-sm font-bold text-[#0d3b2e] hover:bg-white"
                >
                  +
                </button>
                <button
                  type="button"
                  aria-label="Perkecil peta"
                  className="h-8 w-8 border-t border-gray-200 bg-white/95 font-sans text-sm font-bold text-[#0d3b2e] hover:bg-white"
                >
                  −
                </button>
              </div>

              {/* Mode Peta / 360° */}
              <div
                role="tablist"
                aria-label="Mode tampilan"
                className="absolute bottom-4 left-4 flex gap-1 rounded-lg bg-black/50 p-1 backdrop-blur"
              >
                {PETA_KAWASAN.modes.map((item) => {
                  const selected = item.id === mode;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setMode(item.id)}
                      className={`rounded-md px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.06em] transition-colors ${
                        selected
                          ? "bg-[#c5a869] text-[#0d3b2e]"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---- Panel detail ---- */}
            <div className="flex flex-col bg-white p-6 sm:p-8">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#b39556]">
                {active.area}
              </span>
              <h3 className="mt-2 font-sans text-2xl font-bold leading-tight tracking-tight text-[#0d3b2e]">
                {active.name}
              </h3>
              <p className="mt-3 font-sans text-[12.5px] leading-relaxed text-stone-600">
                {active.description}
              </p>

              <dl className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
                {active.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-start justify-between gap-4 py-2.5"
                  >
                    <dt className="font-sans text-[10px] uppercase tracking-[0.05em] text-gray-400">
                      {fact.label}
                    </dt>
                    <dd
                      className={`text-right font-sans text-[11.5px] font-semibold tabular-nums ${
                        fact.highlight ? "text-[#b39556]" : "text-[#0d3b2e]"
                      }`}
                    >
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <a
                href="/kontak"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#0d3b2e] font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:bg-[#134e3f]"
              >
                {PETA_KAWASAN.applyLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
