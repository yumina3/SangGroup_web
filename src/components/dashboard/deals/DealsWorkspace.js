"use client";

import { useMemo, useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import InfoNotice from "@/components/dashboard/InfoNotice";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useToast } from "@/components/dashboard/Toast";
import {
  IconArrowRight,
  IconChevronDown,
  IconClose,
  IconDownload,
  IconKanban,
  IconList,
  IconSearch,
} from "@/components/dashboard/icons";
import {
  DEAL_STAGES,
  dealStageOf,
  dealValueOf,
  stageMeta,
} from "@/lib/dashboard/deal-stages";
import { formatDate, formatRupiah } from "@/lib/dashboard/format";
import { INQUIRY_TYPE, labelOf } from "@/lib/dashboard/status-labels";

import DealCard from "./DealCard";
import DealDrawer from "./DealDrawer";

const TYPE_OPTIONS = [
  { value: "", label: "Semua jenis" },
  { value: "VISIT", label: "Kunjungan" },
  { value: "INTEREST", label: "Minat Beli" },
];

/**
 * Papan Deals / Pipeline (pengembangan lanjutan SRS §3.5).
 *
 * Tahap tidak disimpan sebagai enum baru; `dealStageOf()` menurunkannya dari
 * status pengajuan + status unit. Perpindahan hanya lewat panel detail, dan
 * semua perubahan berhenti sebagai pratinjau di layar. Ekspor CSV dibuat di
 * browser dari baris yang sedang tampil.
 */
export default function DealsWorkspace({ inquiries, properties }) {
  const toast = useToast();
  const [view, setView] = useState("board");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [openId, setOpenId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [saleDrafts, setSaleDrafts] = useState({});

  const effectiveProperties = useMemo(
    () =>
      properties.map((property) =>
        saleDrafts[property.id]
          ? { ...property, saleStatus: saleDrafts[property.id] }
          : property,
      ),
    [properties, saleDrafts],
  );

  const propertyById = useMemo(
    () => new Map(effectiveProperties.map((property) => [property.id, property])),
    [effectiveProperties],
  );

  const effectiveInquiries = useMemo(
    () =>
      inquiries.map((inquiry) => {
        const draft = drafts[inquiry.id];
        if (!draft) return inquiry;
        return {
          ...inquiry,
          status: draft.next,
          sellerNote: draft.note,
          scheduledAt: draft.scheduledAt,
        };
      }),
    [inquiries, drafts],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return effectiveInquiries
      .filter((inquiry) => {
        if (type && inquiry.type !== type) return false;
        if (propertyId && inquiry.property.id !== propertyId) return false;
        if (!keyword) return true;

        const property = propertyById.get(inquiry.property.id);
        const haystack = [
          inquiry.buyer.name,
          inquiry.buyer.email,
          inquiry.buyer.phone,
          inquiry.ticket,
          inquiry.property.title,
          property?.cluster,
          property?.unit,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(keyword);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [effectiveInquiries, propertyById, query, type, propertyId]);

  const cards = useMemo(
    () =>
      filtered.map((inquiry) => {
        const property = propertyById.get(inquiry.property.id) ?? null;
        return {
          inquiry,
          property,
          stage: dealStageOf(inquiry, property),
        };
      }),
    [filtered, propertyById],
  );

  const stageCounts = useMemo(() => {
    const counts = Object.fromEntries(DEAL_STAGES.map((stage) => [stage.key, 0]));
    cards.forEach((card) => {
      counts[card.stage] += 1;
    });
    return counts;
  }, [cards]);

  const totalValue = cards
    .filter((card) => card.stage !== "batal")
    .reduce((sum, card) => sum + dealValueOf(card.inquiry, card.property), 0);

  const activeCard = openId ? cards.find((card) => card.inquiry.id === openId) ?? null : null;
  const hasChanges = Object.keys(drafts).length > 0 || Object.keys(saleDrafts).length > 0;
  const filterActive = Boolean(query || type || propertyId);

  function resetFilters() {
    setQuery("");
    setType("");
    setPropertyId("");
  }

  function resetPreviews() {
    setDrafts({});
    setSaleDrafts({});
    setOpenId(null);
    toast.push("Semua pratinjau dibatalkan; papan kembali ke data demo awal.", "info");
  }

  function exportCsv() {
    if (filtered.length === 0) return;

    const header = [
      "Tiket",
      "Pembeli",
      "Email",
      "Telepon",
      "Jenis",
      "Tahap",
      "Properti",
      "Unit",
      "Harga Tayang",
      "Tawaran",
      "Jadwal Kunjungan",
      "Tanggal Masuk",
      "Catatan",
    ];

    const rows = filtered.map((inquiry) => {
      const property = propertyById.get(inquiry.property.id) ?? null;
      const stage = dealStageOf(inquiry, property);
      return [
        inquiry.ticket,
        inquiry.buyer.name,
        inquiry.buyer.email,
        inquiry.buyer.phone,
        labelOf(INQUIRY_TYPE, inquiry.type),
        stageMeta(stage).label,
        inquiry.property.title,
        [property?.cluster, property?.unit].filter(Boolean).join(" · "),
        property?.price ?? inquiry.property.price,
        typeof inquiry.offerPrice === "number" ? inquiry.offerPrice : "",
        inquiry.scheduledAt ? formatDate(inquiry.scheduledAt) : "",
        formatDate(inquiry.createdAt),
        inquiry.sellerNote ?? "",
      ];
    });

    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `deals-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);

    toast.push(
      `CSV ${filtered.length} pengajuan dibuat dan diunduh di browser. Tidak ada data yang dikirim ke server.`,
      "success",
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen"]}
        title="Deals / Pipeline"
        description="Pantau dan tindak lanjuti pengajuan kunjungan serta minat beli kaveling dalam satu papan. Tahap mengikuti status pengajuan dan status unit yang sah."
        actions={
          <>
            <div
              role="group"
              aria-label="Tampilan pipeline"
              className="inline-flex rounded-lg border border-ag-line bg-white p-1 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setView("board")}
                aria-pressed={view === "board"}
                className={[
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  view === "board"
                    ? "bg-ag-forest text-white shadow-sm"
                    : "text-ag-slate-secondary hover:bg-ag-surface-low hover:text-ag-slate",
                ].join(" ")}
              >
                <IconKanban size={17} />
                Papan
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                className={[
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  view === "list"
                    ? "bg-ag-forest text-white shadow-sm"
                    : "text-ag-slate-secondary hover:bg-ag-surface-low hover:text-ag-slate",
                ].join(" ")}
              >
                <IconList size={17} />
                Daftar
              </button>
            </div>

            <ActionButton
              variant="outline"
              size="md"
              onClick={exportCsv}
              disabled={filtered.length === 0}
            >
              <IconDownload size={17} className="text-ag-gold" />
              Ekspor CSV
            </ActionButton>
          </>
        }
      />

      <InfoNotice
        title="Pratinjau pipeline (belum tersimpan)"
        action={
          hasChanges ? (
            <ActionButton variant="ghost" size="sm" onClick={resetPreviews}>
              Batalkan pratinjau
            </ActionButton>
          ) : null
        }
      >
        Papan menurunkan tujuh tahap dari status pengajuan dan status unit. Tindak lanjut di panel
        detail hanya menjadi pratinjau di layar; belum ada perubahan yang tercatat di database.
      </InfoNotice>

      <section
        aria-label="Filter pipeline"
        className="flex flex-col gap-3 rounded-dash border border-ag-line bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] xl:flex-row xl:items-center xl:justify-between"
      >
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1 md:max-w-md">
            <IconSearch
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ag-slate-muted"
            />
            <label htmlFor="deal-search" className="sr-only">
              Cari nama pembeli, nomor tiket, atau properti
            </label>
            <input
              id="deal-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama pembeli, nomor tiket, atau properti…"
              className="h-9 w-full rounded-lg border border-ag-line bg-white pl-9 pr-3 text-[12.5px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:outline-none"
            />
          </div>

          <div className="relative">
            <label htmlFor="deal-type" className="sr-only">
              Filter jenis pengajuan
            </label>
            <select
              id="deal-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-9 appearance-none rounded-lg border border-ag-line bg-white pl-3 pr-8 text-[12.5px] font-medium text-ag-slate focus:border-ag-gold-base focus:outline-none"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <IconChevronDown
              size={15}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ag-slate-muted"
            />
          </div>

          <div className="relative">
            <label htmlFor="deal-property" className="sr-only">
              Filter properti
            </label>
            <select
              id="deal-property"
              value={propertyId}
              onChange={(event) => setPropertyId(event.target.value)}
              className="h-9 max-w-[220px] appearance-none rounded-lg border border-ag-line bg-white pl-3 pr-8 text-[12.5px] font-medium text-ag-slate focus:border-ag-gold-base focus:outline-none"
            >
              <option value="">Semua properti</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
            <IconChevronDown
              size={15}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ag-slate-muted"
            />
          </div>

          {filterActive ? (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary hover:text-ag-forest"
            >
              <IconClose size={14} />
              Reset
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-ag-line pt-3 text-[11.5px] text-ag-slate-secondary xl:border-t-0 xl:pt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ag-surface-low px-3 py-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ag-gold-base" />
            Total <strong className="font-bold text-ag-forest">{filtered.length}</strong> pengajuan
          </span>
          <span>
            Akumulasi: <strong className="font-bold text-ag-slate">{formatRupiah(totalValue)}</strong>
          </span>
        </div>
      </section>

      {view === "board" ? (
        <>
          <p className="sr-only" role="status">
            {filtered.length} pengajuan ditampilkan dalam tujuh tahap yang tersusun dari atas ke
            bawah.
          </p>
          <div className="flex flex-col gap-3">
            {DEAL_STAGES.map((stage) => {
              const stageCards = cards.filter((card) => card.stage === stage.key);
              return (
                <section
                  key={stage.key}
                  aria-label={`Tahap ${stage.label}`}
                  className="rounded-dash border border-ag-line bg-ag-surface-low/40 p-3.5 sm:p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 rounded-full ${stage.dot}`}
                      />
                      <h2 className="text-[13.5px] font-bold text-ag-slate">{stage.label}</h2>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-ag-slate-secondary">
                        {stageCounts[stage.key]}
                      </span>
                    </div>
                  </div>

                  {stageCards.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                      {stageCards.map((card) => (
                        <DealCard
                          key={card.inquiry.id}
                          inquiry={card.inquiry}
                          property={card.property}
                          stage={card.stage}
                          active={openId === card.inquiry.id}
                          onOpen={() => setOpenId(card.inquiry.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-ag-line bg-white/50 px-3 py-3 text-[11.5px] text-ag-slate-muted">
                      Belum ada pengajuan pada tahap ini.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <div className="overflow-x-auto rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <caption className="sr-only">
              Daftar pengajuan pada pipeline beserta tahap dan nilainya
            </caption>
            <thead>
              <tr className="border-b border-ag-line bg-ag-ivory-surface text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-secondary">
                <th scope="col" className="px-4 py-3">Pembeli</th>
                <th scope="col" className="px-4 py-3">Properti</th>
                <th scope="col" className="px-4 py-3">Jenis</th>
                <th scope="col" className="px-4 py-3">Tahap</th>
                <th scope="col" className="px-4 py-3 text-right">Nilai</th>
                <th scope="col" className="px-4 py-3">Tanggal</th>
                <th scope="col" className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cards.length > 0 ? (
                cards.map((card) => {
                  const meta = stageMeta(card.stage);
                  return (
                    <tr
                      key={card.inquiry.id}
                      className="border-b border-slate-100 text-[12.5px] last:border-b-0 hover:bg-ag-ivory-surface/60"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-ag-slate">{card.inquiry.buyer.name}</p>
                        <p className="text-[10.5px] tabular-nums text-ag-slate-muted">
                          {card.inquiry.ticket}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-ag-slate">{card.inquiry.property.title}</p>
                        <p className="text-[11px] text-ag-slate-muted">
                          {card.property?.cluster ?? "—"}
                          {card.property?.unit ? ` · ${card.property.unit}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={labelOf(INQUIRY_TYPE, card.inquiry.type)}
                          tone={INQUIRY_TYPE[card.inquiry.type]?.tone ?? "neutral"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge label={meta.label} tone={meta.tone} dot />
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-ag-forest">
                        {formatRupiah(dealValueOf(card.inquiry, card.property))}
                      </td>
                      <td className="px-4 py-3 text-ag-slate-secondary">
                        {formatDate(
                          card.stage === "dijadwalkan" && card.inquiry.scheduledAt
                            ? card.inquiry.scheduledAt
                            : card.inquiry.createdAt,
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setOpenId(card.inquiry.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ag-slate-secondary hover:bg-ag-surface-low hover:text-ag-forest"
                        >
                          <IconArrowRight size={17} />
                          <span className="sr-only">
                            Buka detail {card.inquiry.buyer.name} {card.inquiry.ticket}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <p className="text-[13px] font-semibold text-ag-slate">
                      Tidak ada pengajuan pada filter ini
                    </p>
                    <p className="mt-1 text-[12px] text-ag-slate-secondary">
                      Ubah kata kunci atau filter jenis/properti.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === "board" && cards.length === 0 ? (
        <p className="rounded-dash border border-ag-line bg-white px-6 py-10 text-center text-[13px] text-ag-slate-secondary">
          Tidak ada pengajuan yang cocok dengan filter. Ubah kata kunci atau tekan Reset.
        </p>
      ) : null}

      {activeCard ? (
        <DealDrawer
          inquiry={activeCard.inquiry}
          property={activeCard.property}
          stage={activeCard.stage}
          draft={drafts[activeCard.inquiry.id] ?? null}
          saleDraft={
            activeCard.property ? saleDrafts[activeCard.property.id] ?? null : null
          }
          onClose={() => setOpenId(null)}
          onPreview={(draft) =>
            setDrafts((current) => ({ ...current, [activeCard.inquiry.id]: draft }))
          }
          onSalePreview={(id, saleStatus) =>
            setSaleDrafts((current) => ({ ...current, [id]: saleStatus }))
          }
        />
      ) : null}
    </div>
  );
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}
