"use client";

import { IconArrowRight, IconClock } from "@/components/dashboard/icons";
import { stageMeta } from "@/lib/dashboard/deal-stages";
import { formatDate, formatRupiah } from "@/lib/dashboard/format";
import { INQUIRY_TYPE, SALE_STATUS, labelOf } from "@/lib/dashboard/status-labels";

/**
 * Kartu pengajuan pada papan pipeline.
 *
 * Seluruh kartu adalah satu tombol; detail dibuka di panel samping. Tidak ada
 * drag-and-drop: perpindahan tahap hanya lewat form di panel detail agar
 * setiap perubahan punya catatan dan melewati matriks transisi SRS §6.8.
 */
export default function DealCard({ inquiry, property, stage, active, onOpen }) {
  const meta = stageMeta(stage);
  const typeMeta = INQUIRY_TYPE[inquiry.type] ?? INQUIRY_TYPE.VISIT;
  const dateValue =
    stage === "dijadwalkan" && inquiry.scheduledAt ? inquiry.scheduledAt : inquiry.createdAt;
  const saleMeta =
    stage === "deal" && property?.saleStatus ? SALE_STATUS[property.saleStatus] : null;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Buka detail ${inquiry.buyer.name}, tiket ${inquiry.ticket}, tahap ${meta.label}`}
      className={[
        "group relative w-full cursor-pointer rounded-lg border border-transparent border-l-4 bg-white p-3.5 text-left shadow-sm transition-shadow hover:shadow-md",
        meta.border,
        active ? "ring-2 ring-ag-gold-base ring-offset-1" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="truncate text-[15px] font-bold text-ag-slate group-hover:text-ag-forest">
            {inquiry.buyer.name}
          </span>
          <span className="rounded-tag bg-ag-surface-low px-2 py-0.5 text-[11px] font-bold text-ag-forest">
            {labelOf(INQUIRY_TYPE, inquiry.type)}
          </span>
        </div>
        <IconArrowRight
          size={16}
          className="mt-0.5 shrink-0 text-ag-slate-muted opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      <p className="mt-1.5 truncate text-[13.5px] font-semibold text-ag-slate">
        {inquiry.property.title}
      </p>
      <p className="truncate text-[11.5px] text-ag-slate-muted">
        {property?.cluster ?? "Listing Anda"}
        {property?.unit ? ` · Unit ${property.unit}` : ""}
      </p>

      {stage === "negosiasi" && typeof inquiry.offerPrice === "number" ? (
        <p className="mt-2 rounded-tag bg-amber-50 px-2 py-1.5 text-[11.5px] font-semibold text-amber-800">
          Tawaran pembeli {formatRupiah(inquiry.offerPrice)}
        </p>
      ) : null}

      {stage === "batal" && inquiry.sellerNote ? (
        <p className="mt-2 line-clamp-2 rounded-tag bg-red-50 px-2 py-1.5 text-[11.5px] leading-relaxed text-red-700">
          <span className="font-bold">Alasan:</span> {inquiry.sellerNote}
        </p>
      ) : null}

      {stage === "deal" && saleMeta ? (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-tag bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ag-available" />
          Unit {saleMeta.label.toLowerCase()}
        </p>
      ) : null}

      {inquiry.status === "RESCHEDULED" && stage === "dijadwalkan" ? (
        <p className="mt-2 inline-flex rounded-tag bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
          Dijadwal ulang
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2 text-ag-slate-muted">
        <span className="flex min-w-0 items-center gap-1 text-[11.5px]">
          <IconClock size={14} className="shrink-0" />
          <span className="truncate">{formatDate(dateValue)}</span>
        </span>
        <span className="shrink-0 text-[12.5px] font-bold text-ag-forest">
          {formatRupiah(property?.price ?? inquiry.property.price)}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 text-[10.5px] text-ag-slate-muted">
        <span className="tabular-nums">{inquiry.ticket}</span>
        <span className="font-semibold text-ag-slate-secondary">{meta.label}</span>
      </div>
    </button>
  );
}
