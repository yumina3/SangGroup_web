"use client";

import { useState } from "react";

import FavoriteButton from "@/components/site/FavoriteButton";
import { formatRupiahShort } from "@/lib/dashboard/format";
import { loginPathForRole } from "@/lib/auth/redirects";
import { businessStatusMeta } from "@/lib/properties/labels";
import { PORTFOLIO } from "@/lib/site/data";

/**
 * Section 5: portofolio kawasan hunian.
 *
 * Tab mengganti kartu sesuai kawasan. Data kartu berasal dari tabel
 * `properties` (lewat props server) agar setiap kartu punya UUID untuk
 * disimpan ke favorit pembeli. Foto tetap memakai aset statis yang sudah ada
 * karena objek Storage hasil seed belum tersedia.
 */
export default function PortfolioSection({
  properties = [],
  viewer = {},
  favoriteIds = [],
}) {
  const [activeTab, setActiveTab] = useState(PORTFOLIO.tabs[0].id);

  const activeProject =
    PORTFOLIO.tabs.find((tab) => tab.id === activeTab) ?? PORTFOLIO.tabs[0];
  const cards = properties.filter(
    (property) => property.projectSlug === activeProject.slug,
  );
  const favorites = new Set(favoriteIds);
  const loginHref = loginPathForRole("buyer", {
    next: "/#portfolio",
    reason: "unauth",
  });

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

        {cards.length === 0 ? (
          <p className="text-center text-xs text-emerald-100/70">
            Belum ada unit {activeProject.label} yang tayang. Hubungi konsultan
            kami untuk informasi ketersediaan terbaru.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-3">
            {cards.map((property, index) => {
              const status = businessStatusMeta(property.businessStatus);
              const fallbackImage =
                PORTFOLIO.items.dipa[index % PORTFOLIO.items.dipa.length];

              return (
                <li key={property.id}>
                  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#c5a869]/30 bg-white text-gray-800 shadow-[0_4px_20px_-2px_rgba(13,59,46,0.25)] transition-transform duration-200 hover:-translate-y-1">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fallbackImage.image}
                        alt={property.title}
                        className="h-[190px] w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-md bg-[#c5a869] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#0d3b2e]">
                        {status.label}
                      </span>
                      <span className="absolute right-3 top-3 rounded-md bg-[#0d3b2e] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.04em] text-[#e6c875]">
                        {formatRupiahShort(property.price)}
                      </span>

                      <FavoriteButton
                        propertyId={property.id}
                        initialFavorite={favorites.has(property.id)}
                        isAuthenticated={Boolean(viewer.isAuthenticated)}
                        isBuyer={Boolean(viewer.isBuyer)}
                        isActive={viewer.isActive !== false}
                        accountStatus={viewer.status ?? null}
                        loginHref={loginHref}
                        compact
                        className="absolute bottom-3 right-3 z-10"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#c5a869]">
                        {property.projectName}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-gray-400">
                        Tipe {property.buildingArea} / {property.landArea}
                      </p>
                      <h3 className="mt-2 font-sans text-[19px] font-bold leading-snug text-[#0d3b2e]">
                        {property.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[11.5px] leading-relaxed text-gray-500">
                        {property.description ||
                          "Deskripsi lengkap unit ini dapat ditanyakan langsung kepada konsultan SANG Group."}
                      </p>

                      <dl className="mt-4 grid grid-cols-4 gap-1 border-t border-gray-100 pt-3">
                        <div>
                          <dt className="text-[8.5px] uppercase tracking-[0.04em] text-gray-400">
                            K.Tidur
                          </dt>
                          <dd className="mt-0.5 text-[12px] font-bold tabular-nums text-[#0d3b2e]">
                            {property.bedrooms}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[8.5px] uppercase tracking-[0.04em] text-gray-400">
                            K.Mandi
                          </dt>
                          <dd className="mt-0.5 text-[12px] font-bold tabular-nums text-[#0d3b2e]">
                            {property.bathrooms}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[8.5px] uppercase tracking-[0.04em] text-gray-400">
                            L.Tanah
                          </dt>
                          <dd className="mt-0.5 text-[12px] font-bold tabular-nums text-[#0d3b2e]">
                            {property.landArea}m&sup2;
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[8.5px] uppercase tracking-[0.04em] text-gray-400">
                            L.Bangunan
                          </dt>
                          <dd className="mt-0.5 text-[12px] font-bold tabular-nums text-[#0d3b2e]">
                            {property.buildingArea}m&sup2;
                          </dd>
                        </div>
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
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
