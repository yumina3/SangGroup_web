"use client";

import { useState } from "react";

import { GIS } from "@/lib/site/data";

/**
 * Section 6: lokasi GIS.
 *
 * Tab atas mengganti panel kanan dan menyorot marker terkait.
 */
export default function GisSection() {
  const [activeTab, setActiveTab] = useState(GIS.tabs[0].id);
  const panel = GIS.panels[activeTab] ?? GIS.panels.all;

  const isActive = (id) => activeTab === "all" || activeTab === id;

  return (
    <section id="gis" className="bg-[#faf8f5] px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="block font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#c5a059]">
            {GIS.eyebrow}
          </span>
          <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
            {GIS.heading}
          </h2>
          <p className="mt-3 font-sans text-xs text-gray-500 sm:text-sm">
            {GIS.body}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Pilih kawasan pada peta"
          className="mb-8 mt-8 flex flex-wrap justify-center gap-2"
        >
          {GIS.tabs.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  selected
                    ? "border-[#c5a869] bg-[#c5a869] text-[#0d3b2e]"
                    : "border-gray-300 text-gray-600 hover:border-[#0d3b2e] hover:text-[#0d3b2e]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid overflow-hidden rounded-xl border border-[#0d3b2e]/15 md:grid-cols-[1.15fr_0.85fr]">
          {/* Peta */}
          <div className="relative min-h-[360px] bg-[#07231a] p-5 sm:min-h-[440px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_35%_40%,rgba(197,168,89,0.14),transparent_62%)]"
            />

            <div className="relative flex items-start justify-between gap-4">
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#c5a869]/90">
                {GIS.mapTopLeft}
              </p>
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
                {GIS.mapTopRight}
              </p>
            </div>

            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                points="28,30 64,52 45,74"
                fill="none"
                stroke="rgba(197,168,89,0.5)"
                strokeWidth="0.4"
                strokeDasharray="2 1.6"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {GIS.markers.map((marker) => (
              <div
                key={marker.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-sans text-[10px] font-bold transition-all ${
                      isActive(marker.id)
                        ? "bg-[#c5a869] text-[#0d3b2e] ring-2 ring-white/40"
                        : "bg-[#c5a869]/30 text-[#0d3b2e]/60"
                    }`}
                  >
                    {marker.number}
                  </span>
                  <span className="mt-0.5">
                    <span className="block whitespace-nowrap font-sans text-[10px] font-bold uppercase tracking-[0.05em] text-white">
                      {marker.label}
                    </span>
                    <span className="block whitespace-nowrap font-sans text-[9px] text-white/55">
                      {marker.sub}
                    </span>
                  </span>
                </div>
              </div>
            ))}

            <div className="absolute inset-x-5 bottom-12 flex flex-wrap items-center gap-2">
              <span className="font-sans text-[9px] uppercase tracking-[0.1em] text-white/40">
                Mode Peta:
              </span>
              {GIS.mapModes.map((mode, index) => (
                <span
                  key={mode}
                  className={`rounded-full px-2.5 py-1 font-sans text-[9px] font-semibold ${
                    index === 0
                      ? "bg-[#c5a869] text-[#0d3b2e]"
                      : "bg-white/10 text-white/55"
                  }`}
                >
                  {mode}
                </span>
              ))}
            </div>

            <p className="absolute inset-x-5 bottom-4 text-right font-sans text-[8.5px] tracking-[0.06em] text-white/30">
              {GIS.coordinates}
            </p>
          </div>

          {/* Panel kanan */}
          <div className="bg-[#0d3b2e] p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#c5a869]">
                {panel.eyebrow}
              </span>
              <span className="rounded-full border border-[#c5a869]/40 px-2 py-0.5 font-sans text-[8.5px] font-semibold uppercase tracking-[0.06em] text-[#c5a869]">
                {panel.chip}
              </span>
            </div>

            <h3 className="mt-3 font-sans text-2xl font-bold leading-tight text-white">
              {panel.title}
            </h3>
            <p className="mt-3 font-sans text-[11.5px] leading-relaxed text-white/65">
              {panel.description}
            </p>

            <dl className="mt-5 divide-y divide-white/10 border-t border-white/10">
              {panel.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-start justify-between gap-4 py-2.5"
                >
                  <dt className="font-sans text-[10px] uppercase tracking-[0.05em] text-white/45">
                    {fact.label}
                  </dt>
                  <dd
                    className={`text-right font-sans text-[11px] font-semibold tabular-nums ${
                      fact.highlight ? "text-[#e6c875]" : "text-white"
                    }`}
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href="/kontak"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#c5a869] font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#0d3b2e] no-underline transition-colors hover:bg-[#d4af37]"
              >
                {GIS.ctaPrimary}
              </a>
              <a
                href="/kontak"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/30 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:border-white hover:bg-white/10"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1-1-.3-2.4-1-3.7-2.3-1.3-1.3-2-2.7-2.3-3.7-.2-.7-.2-1.2-.1-1.7.1-.5.7-1.5 1.2-1.7.3-.1.7-.1.9.1l1 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5.4.7 1 1.4 1.7 1.9.2.1.3.1.5 0l.7-.5c.2-.1.4-.1.6 0l1.9 1c.2.1.2.5.1.9Z" />
                </svg>
                {GIS.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
