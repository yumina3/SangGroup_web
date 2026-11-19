"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import HelpSupportCard from "@/components/dashboard/help/HelpSupportCard";
import HelpSystemStatus from "@/components/dashboard/help/HelpSystemStatus";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  IconArrowRight,
  IconChevronDown,
  IconClose,
  IconFileText,
  IconHelp,
  IconSearch,
} from "@/components/dashboard/icons";

function matchesTerm(item, term, fields) {
  if (!term) return true;
  return fields.some((field) => String(item[field] ?? "").toLowerCase().includes(term));
}

/**
 * Pusat Bantuan agen.
 *
 * Struktur halaman mengikuti acuan visual
 * `docs/agen/help_center_sang_group_semarang/code.html`, tetapi seluruh shell
 * (sidebar/topbar) tetap milik layout `/dashboard/penjual`. Pencarian dan
 * accordion berjalan di klien; kontennya berasal dari `help-data.js`.
 */
export default function PusatBantuanPenjual({ guides, faqs, support, systemStatus }) {
  const [query, setQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id ?? null);

  const term = query.trim().toLowerCase();
  const hasQuery = term.length > 0;

  const filteredGuides = useMemo(
    () => guides.filter((item) => matchesTerm(item, term, ["title", "description", "keywords"])),
    [guides, term],
  );

  const filteredFaqs = useMemo(
    () => faqs.filter((item) => matchesTerm(item, term, ["question", "answer", "keywords"])),
    [faqs, term],
  );

  function clearSearch() {
    setQuery("");
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      clearSearch();
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Pusat Bantuan"]}
        title="Pusat Bantuan"
        description="Temukan solusi, panduan penggunaan sistem, dan bantuan operasional listing Anda."
      />

      <div className="relative max-w-3xl overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-colors focus-within:border-ag-gold-base">
        <div className="flex items-center gap-3 px-4 py-3">
          <IconSearch size={20} className="shrink-0 text-ag-slate-muted" />
          <label htmlFor="help-search" className="sr-only">
            Cari panduan, kata kunci, atau pertanyaan seputar sistem
          </label>
          <input
            id="help-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari panduan, kata kunci, atau pertanyaan seputar sistem..."
            className="h-6 w-full bg-transparent text-[13.5px] text-ag-slate placeholder:text-ag-slate-muted focus:outline-none"
          />
          {hasQuery ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Bersihkan pencarian"
              className="shrink-0 rounded p-1 text-ag-slate-muted transition-colors hover:bg-ag-surface-low hover:text-ag-slate"
            >
              <IconClose size={16} />
            </button>
          ) : (
            <kbd className="hidden shrink-0 rounded border border-ag-line bg-ag-surface-low px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ag-slate-muted sm:inline-block">
              ESC
            </kbd>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {hasQuery
          ? `${filteredGuides.length} panduan dan ${filteredFaqs.length} pertanyaan cocok dengan pencarian.`
          : ""}
      </p>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <section aria-labelledby="help-guides-heading">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <IconFileText size={19} className="text-ag-gold-base" />
                <h2 id="help-guides-heading" className="text-[15px] font-bold text-ag-forest">
                  Panduan Cepat
                </h2>
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-muted">
                {hasQuery ? `${filteredGuides.length} hasil` : `${guides.length} Alur Utama`}
              </span>
            </div>

            <div className="overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              {filteredGuides.length > 0 ? (
                <ul className="divide-y divide-ag-line">
                  {filteredGuides.map((guide) => (
                    <li key={guide.id}>
                      <Link
                        href={guide.href}
                        className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-ag-ivory-surface"
                      >
                        <span className="min-w-0">
                          <span className="block text-[14px] font-bold text-ag-slate transition-colors group-hover:text-ag-forest">
                            {guide.title}
                          </span>
                          <span className="mt-1 block text-[12.5px] leading-relaxed text-ag-slate-secondary">
                            {guide.description}
                          </span>
                        </span>
                        <IconArrowRight
                          size={20}
                          className="shrink-0 text-ag-gold-base transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p role="status" className="px-5 py-8 text-center text-[13px] text-ag-slate-secondary">
                  Tidak ada panduan yang cocok dengan “{query.trim()}”.
                </p>
              )}
            </div>
          </section>

          <section aria-labelledby="help-faq-heading">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <IconHelp size={19} className="text-ag-gold-base" />
                <h2 id="help-faq-heading" className="text-[15px] font-bold text-ag-forest">
                  Pertanyaan Umum (FAQ)
                </h2>
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-muted">
                {hasQuery ? `${filteredFaqs.length} hasil` : "Basis Pengetahuan"}
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const open = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(open ? null : faq.id)}
                        aria-expanded={open}
                        aria-controls={`help-faq-body-${faq.id}`}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="text-[13.5px] font-bold leading-snug text-ag-slate">
                          {faq.question}
                        </span>
                        <IconChevronDown
                          size={18}
                          className={[
                            "mt-0.5 shrink-0 transition-transform",
                            open ? "rotate-180 text-ag-gold-base" : "text-ag-slate-muted",
                          ].join(" ")}
                        />
                      </button>
                      <div
                        id={`help-faq-body-${faq.id}`}
                        hidden={!open}
                        className="px-5 pb-4 text-[12.5px] leading-relaxed text-ag-slate-secondary"
                      >
                        {faq.answer}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-dash border border-ag-line bg-white px-5 py-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                  <p role="status" className="text-[13px] text-ag-slate-secondary">
                    Tidak ada pertanyaan yang cocok dengan “{query.trim()}”.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-5">
          <HelpSupportCard support={support} />
          <HelpSystemStatus status={systemStatus} />
        </div>
      </div>
    </div>
  );
}
