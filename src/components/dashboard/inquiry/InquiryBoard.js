"use client";

import { useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import Modal from "@/components/dashboard/Modal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useToast } from "@/components/dashboard/Toast";
import {
  FOLLOW_UP_NOTE_MAX,
  isAllowedTransition,
  RESCHEDULE_STATUS,
  validateFollowUp,
  waMessage,
  waNumber,
} from "@/lib/dashboard/inquiry-rules";
import { formatRupiah, formatDateTime, formatLongDate } from "@/lib/dashboard/format";
import { INQUIRY_STATUS, INQUIRY_TYPE, labelOf } from "@/lib/dashboard/status-labels";

/**
 * Papan pengajuan penjual (SRS-F-SEL-09, SEL-10).
 *
 * - Daftar memakai kartu, bukan tabel lebar, supaya nyaman di ponsel
 *   (SRS-D-07); di layar lebar kartu tersusun dua kolom.
 * - Tombol tindak lanjut hanya menampilkan transisi yang sah menurut matriks
 *   SRS §6.8 (`transitions` dikirim dari server) dan diverifikasi ulang dengan
 *   `isAllowedTransition` sebelum dikirim.
 * - Tindak lanjut memerlukan catatan (minimal 5 karakter) dan, untuk jadwal
 *   ulang, tanggal kunjungan baru di masa depan.
 * - Karena penyimpanan belum tersambung, perubahan hanya dicatat di layar
 *   sebagai pratinjau dengan label jelas, bukan "berhasil" palsu.
 */
export default function InquiryBoard({ items, properties, transitions, filterLabel, focusId = null }) {
  const [drafts, setDrafts] = useState({});
  const [editing, setEditing] = useState(null);

  const propertyById = new Map(properties.map((item) => [item.id, item]));

  if (items.length === 0) {
    return (
      <section className="rounded-dash border border-ag-line bg-white px-6 py-14 text-center">
        <p className="text-[14px] font-semibold text-ag-slate">
          Tidak ada pengajuan pada filter “{filterLabel}”
        </p>
        <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-ag-slate-secondary">
          Ubah filter atau kata kunci. Pengajuan baru muncul setelah listing Anda terverifikasi dan
          calon pembeli menghubungi dari katalog.
        </p>
      </section>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        {items.map((inquiry) => {
          const draft = drafts[inquiry.id];
          const status = draft ? draft.next : inquiry.status;
          const statusMeta = INQUIRY_STATUS[status] ?? INQUIRY_STATUS.PENDING;
          const typeMeta = INQUIRY_TYPE[inquiry.type] ?? INQUIRY_TYPE.VISIT;
          const actions = (transitions[inquiry.status] ?? []).filter((next) =>
            isAllowedTransition(inquiry.status, next),
          );
          const property = propertyById.get(inquiry.property.id);
          const whatsapp = waNumber(inquiry.buyer.phone);
          const highlighted = focusId === inquiry.id;
          const note = draft ? draft.note : inquiry.sellerNote;
          const scheduledAt = draft?.scheduledAt ?? inquiry.scheduledAt;

          return (
            <li
              key={inquiry.id}
              id={`pengajuan-${inquiry.id}`}
              className={`flex flex-col rounded-dash border bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${
                highlighted ? "border-ag-gold-base ring-2 ring-ag-gold-base/30" : "border-ag-line"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-ag-slate">{inquiry.buyer.name}</p>
                  <p className="text-[12px] text-ag-slate-muted">
                    Masuk {formatDateTime(inquiry.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge label={typeMeta.label} tone={typeMeta.tone} />
                  <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
                </div>
              </div>

              <div className="flex-1 space-y-3 px-4 py-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ag-slate-muted">
                    Properti
                  </p>
                  <p className="text-[13px] font-semibold text-ag-slate">
                    {property ? (
                      <a
                        href={`/dashboard/penjual/properti/${property.id}/ubah`}
                        className="hover:text-ag-forest hover:underline"
                      >
                        {inquiry.property.title}
                      </a>
                    ) : (
                      inquiry.property.title
                    )}
                    {property?.unit ? (
                      <span className="font-normal text-ag-slate-muted"> · Unit {property.unit}</span>
                    ) : null}
                  </p>
                  <p className="text-[12px] text-ag-slate-secondary">
                    Harga tayang {formatRupiah(property?.price ?? inquiry.property.price)}
                    {inquiry.offerPrice
                      ? ` · tawaran pembeli ${formatRupiah(inquiry.offerPrice)}`
                      : ""}
                  </p>
                </div>

                {scheduledAt ? (
                  <p className="rounded-tag bg-ag-surface-low px-2.5 py-1.5 text-[12px] font-medium text-ag-slate">
                    Jadwal: {formatLongDate(scheduledAt)}
                  </p>
                ) : null}

                {inquiry.message ? (
                  <p className="text-[12.5px] leading-relaxed text-ag-slate-secondary">
                    “{inquiry.message}”
                  </p>
                ) : null}

                {note ? (
                  <p className="border-l-2 border-ag-gold/50 pl-2.5 text-[12px] italic leading-relaxed text-ag-slate-muted">
                    {draft ? "Catatan pratinjau" : "Catatan Anda"}: {note}
                  </p>
                ) : null}

                {draft ? (
                  <p
                    role="status"
                    className="rounded-tag border border-ag-gold/30 bg-ag-gold/10 px-2.5 py-2 text-[12px] leading-relaxed text-[#7a5c1a]"
                  >
                    Pratinjau (belum tersimpan): status akan menjadi{" "}
                    <strong className="font-semibold">{labelOf(INQUIRY_STATUS, draft.next)}</strong>{" "}
                    dengan catatan “{draft.note}”.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-ag-ivory-surface px-4 py-2.5">
                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage(inquiry))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] font-semibold text-ag-forest hover:underline"
                  >
                    Hubungi via WhatsApp
                    <span className="sr-only"> — {inquiry.buyer.name}</span>
                  </a>
                ) : (
                  <span className="text-[12px] text-ag-slate-muted">Nomor pembeli tidak tersedia</span>
                )}

                {actions.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {actions.map((next) => (
                      <ActionButton
                        key={next}
                        size="sm"
                        variant={next === "REJECTED" ? "outline" : "forest"}
                        onClick={() => setEditing({ inquiry, next })}
                      >
                        {labelOf(INQUIRY_STATUS, next)}
                      </ActionButton>
                    ))}
                  </div>
                ) : (
                  <span className="text-[12px] text-ag-slate-muted">Tidak ada tindakan tersisa</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {editing ? (
        <FollowUpDialog
          key={`${editing.inquiry.id}-${editing.next}`}
          inquiry={editing.inquiry}
          next={editing.next}
          onClose={() => setEditing(null)}
          onPreview={(draft) => setDrafts((current) => ({ ...current, [editing.inquiry.id]: draft }))}
        />
      ) : null}
    </>
  );
}

function placeholderFor(next) {
  if (next === "CONFIRMED") return "Konfirmasi jadwal dan apa yang perlu pembeli bawa.";
  if (next === "RESCHEDULED") return "Usulkan tanggal dan jam baru beserta alasannya.";
  if (next === "REJECTED") return "Jelaskan alasan penolakan dengan sopan.";
  return "Ringkas hasil kunjungan atau kesepakatan dengan pembeli.";
}

function FollowUpDialog({ inquiry, next, onClose, onPreview }) {
  const [note, setNote] = useState(inquiry.sellerNote ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [error, setError] = useState("");
  const toast = useToast();

  const needsSchedule = next === RESCHEDULE_STATUS;
  const scheduledAt = needsSchedule && date ? `${date}T${time || "09:00"}:00+07:00` : null;

  function save() {
    const result = validateFollowUp({ next, note, scheduledAt });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    onPreview({ next, note: result.note, scheduledAt });
    toast.push(
      `Pratinjau tersimpan di layar: status ${labelOf(INQUIRY_STATUS, inquiry.status)} → ${labelOf(
        INQUIRY_STATUS,
        next,
      )}. Penyimpanan pengajuan belum aktif, jadi belum tercatat.`,
      "info",
    );
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Tandai ${labelOf(INQUIRY_STATUS, next).toLowerCase()}`}
      description={`${inquiry.buyer.name} · ${inquiry.property.title}`}
      footer={
        <>
          <ActionButton variant="outline" size="md" onClick={onClose}>
            Batal
          </ActionButton>
          <ActionButton variant="primary" size="md" onClick={save}>
            Simpan tindak lanjut
          </ActionButton>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-[12.5px] leading-relaxed text-ag-slate-secondary">
          Status sekarang{" "}
          <strong className="font-semibold text-ag-slate">
            {labelOf(INQUIRY_STATUS, inquiry.status)}
          </strong>{" "}
          akan menjadi{" "}
          <strong className="font-semibold text-ag-slate">{labelOf(INQUIRY_STATUS, next)}</strong>.
          Catatan ikut dikirim ke pembeli dan tercatat di log status pengajuan.
        </p>

        {needsSchedule ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="follow-up-date" className="mb-1 block text-[13px] font-semibold text-ag-slate">
                Tanggal kunjungan baru
              </label>
              <input
                id="follow-up-date"
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setError("");
                }}
                aria-invalid={error ? true : undefined}
                className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] text-ag-slate outline-none hover:border-ag-slate-muted focus:border-ag-gold-base"
              />
            </div>
            <div>
              <label htmlFor="follow-up-time" className="mb-1 block text-[13px] font-semibold text-ag-slate">
                Jam
              </label>
              <input
                id="follow-up-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] text-ag-slate outline-none hover:border-ag-slate-muted focus:border-ag-gold-base"
              />
            </div>
          </div>
        ) : null}

        <div>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <label htmlFor="follow-up-note" className="text-[13px] font-semibold text-ag-slate">
              Catatan tindak lanjut
            </label>
            <span className="text-[11px] text-ag-slate-muted">
              {note.length}/{FOLLOW_UP_NOTE_MAX}
            </span>
          </div>
          <textarea
            id="follow-up-note"
            data-autofocus
            rows={4}
            maxLength={FOLLOW_UP_NOTE_MAX}
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setError("");
            }}
            placeholder={placeholderFor(next)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "follow-up-note-error" : undefined}
            className={`w-full resize-y rounded-lg border px-3 py-2.5 text-[13px] leading-relaxed text-ag-slate outline-none ${
              error
                ? "border-red-400 focus:border-red-500"
                : "border-ag-line hover:border-ag-slate-muted focus:border-ag-gold-base"
            }`}
          />
          {error ? (
            <p id="follow-up-note-error" role="alert" className="mt-1 text-[11.5px] font-semibold text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
