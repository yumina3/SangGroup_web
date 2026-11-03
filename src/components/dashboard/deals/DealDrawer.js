"use client";

import { useEffect, useRef, useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import Modal from "@/components/dashboard/Modal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useToast } from "@/components/dashboard/Toast";
import {
  IconArrowRight,
  IconBan,
  IconBuilding,
  IconCheckCircle,
  IconClock,
  IconClose,
  IconMail,
  IconMessage,
  IconPhone,
} from "@/components/dashboard/icons";
import {
  PIPELINE_STEPS,
  actionMeta,
  pipelineStepIndex,
  stageMeta,
} from "@/lib/dashboard/deal-stages";
import { formatDateTime, formatRupiah, initialsOf } from "@/lib/dashboard/format";
import {
  FOLLOW_UP_NOTE_MAX,
  isAllowedTransition,
  RESCHEDULE_STATUS,
  validateFollowUp,
  waMessage,
  waNumber,
} from "@/lib/dashboard/inquiry-rules";
import {
  INQUIRY_STATUS,
  INQUIRY_TYPE,
  SALE_STATUS,
  SELLER_INQUIRY_ACTIONS,
  allowedSaleTransitions,
  labelOf,
} from "@/lib/dashboard/status-labels";

const SALE_CHOICE_DESCRIPTION = {
  BOOKED: "Kunci unit untuk verifikasi berkas. Status kaveling menjadi dipesan.",
  SOLD: "Pembayaran uang muka atau pelunasan sudah dikonfirmasi.",
  AVAILABLE: "Buka kembali unit ke katalog dan batalkan pemesanan.",
};

/**
 * Panel detail pengajuan pada halaman Deals / Pipeline.
 *
 * Semua perubahan hanya menjadi pratinjau di layar (`onPreview`), tidak
 * menyentuh database. Pilihan status tetap dibatasi `SELLER_INQUIRY_ACTIONS`
 * dan status unit dibatasi `allowedSaleTransitions` supaya panel tidak pernah
 * menawarkan transisi yang dilarang SRS §6.8.
 */
export default function DealDrawer({
  inquiry,
  property,
  stage,
  draft,
  saleDraft,
  onClose,
  onPreview,
  onSalePreview,
}) {
  const toast = useToast();
  const closeRef = useRef(null);
  const [saleOpen, setSaleOpen] = useState(false);
  const [saleTarget, setSaleTarget] = useState("");
  const activeStage = stageMeta(stage);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const actions = (SELLER_INQUIRY_ACTIONS[inquiry.status] ?? []).filter((next) =>
    isAllowedTransition(inquiry.status, next),
  );

  const saleOptions = allowedSaleTransitions(property ?? {});
  const saleMeta = property?.saleStatus ? SALE_STATUS[property.saleStatus] : null;
  const whatsapp = waNumber(inquiry.buyer.phone);
  const stepIndex = pipelineStepIndex(stage);

  function openSaleModal() {
    setSaleTarget(saleOptions[0] ?? "");
    setSaleOpen(true);
  }

  function applySale() {
    if (!saleTarget) return;

    onSalePreview(property.id, saleTarget);
    toast.push(
      `Pratinjau: status unit ${property.unit || inquiry.property.title} → ${
        labelOf(SALE_STATUS, saleTarget)
      }. Belum tersimpan ke database, jadi status listing belum berubah.`,
      "info",
    );
    setSaleOpen(false);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ag-forest/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="deal-drawer-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-ag-line bg-white shadow-2xl sm:w-[420px]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-ag-line bg-ag-ivory-surface px-5 py-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 id="deal-drawer-title" className="text-[15px] font-bold tabular-nums text-ag-forest">
              {inquiry.ticket}
            </h2>
            <StatusBadge label={activeStage.label} tone={activeStage.tone} dot />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ag-slate-muted hover:bg-ag-surface-low hover:text-ag-slate"
          >
            <IconClose size={18} />
            <span className="sr-only">Tutup detail pengajuan</span>
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {draft ? (
            <p
              role="status"
              className="rounded-tag border border-ag-gold/30 bg-ag-gold/10 px-3 py-2 text-[12px] leading-relaxed text-[#7a5c1a]"
            >
              <strong className="font-semibold">Pratinjau di layar.</strong> Perubahan status dan
              catatan di bawah belum tersimpan ke database.
            </p>
          ) : null}

          <section className="rounded-xl bg-ag-surface-low/70 p-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ag-gold/30 bg-ag-forest text-[15px] font-bold text-ag-gold-base"
              >
                {initialsOf(inquiry.buyer.name)}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-[16px] font-bold text-ag-slate">{inquiry.buyer.name}</h3>
                <p className="text-[12px] text-ag-slate-secondary">
                  Klien potensial · {labelOf(INQUIRY_TYPE, inquiry.type)}
                </p>
              </div>
            </div>

            <dl className="mt-3 space-y-1.5 border-t border-ag-line/70 pt-3 text-[12.5px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-ag-slate-muted">
                  <IconPhone size={15} />
                  Nomor kontak
                </dt>
                <dd className="truncate font-semibold text-ag-slate">{inquiry.buyer.phone}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-ag-slate-muted">
                  <IconMail size={15} />
                  Email
                </dt>
                <dd className="truncate text-ag-slate">{inquiry.buyer.email}</dd>
              </div>
            </dl>

            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage(inquiry))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[12.5px] font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                <IconMessage size={17} />
                Hubungi via WhatsApp
              </a>
            ) : null}
          </section>

          <section className="flex items-center gap-3 rounded-xl border border-ag-line bg-white p-4 shadow-sm">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-ag-surface-low text-ag-forest"
            >
              <IconBuilding size={26} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-ag-gold-muted">
                Unit terkait
              </p>
              <p className="truncate text-[13.5px] font-bold text-ag-slate">
                {inquiry.property.title}
              </p>
              <p className="truncate text-[11.5px] text-ag-slate-muted">
                {property?.cluster ?? "Listing Anda"}
                {property?.unit ? ` · Unit ${property.unit}` : ""}
              </p>
              <p className="text-[13px] font-bold text-ag-forest">
                {formatRupiah(property?.price ?? inquiry.property.price)}
              </p>
              {property ? (
                <a
                  href={`/dashboard/penjual/properti/${property.id}/ubah`}
                  className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-ag-forest-medium hover:text-ag-forest hover:underline"
                >
                  Lihat listing
                  <IconArrowRight size={13} />
                </a>
              ) : null}
            </div>
          </section>

          {typeof inquiry.offerPrice === "number" ? (
            <p className="rounded-tag border border-amber-200 bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">
              Tawaran pembeli{" "}
              <strong className="font-bold">{formatRupiah(inquiry.offerPrice)}</strong> dari harga
              tayang {formatRupiah(property?.price ?? inquiry.property.price)}.
            </p>
          ) : null}

          <section className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-[11.5px]">
              <span className="text-ag-slate-muted">Tanggal pengajuan</span>
              <span className="font-semibold text-ag-slate">
                {formatDateTime(inquiry.createdAt)}
              </span>
            </div>
            {inquiry.scheduledAt ? (
              <div className="flex items-center justify-between gap-2 text-[11.5px]">
                <span className="text-ag-slate-muted">Jadwal kunjungan</span>
                <span className="font-semibold text-ag-slate">
                  {formatDateTime(inquiry.scheduledAt)}
                </span>
              </div>
            ) : null}
            {inquiry.message ? (
              <div className="rounded-lg bg-ag-surface-low/60 p-3">
                <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-muted">
                  Pesan pembeli
                </p>
                <p className="text-[12.5px] italic leading-relaxed text-ag-slate">
                  “{inquiry.message}”
                </p>
              </div>
            ) : null}
            {inquiry.sellerNote ? (
              <div className="border-l-2 border-ag-gold/50 pl-2.5 text-[12px] italic leading-relaxed text-ag-slate-muted">
                {draft ? "Catatan pratinjau" : "Catatan Anda"}: {inquiry.sellerNote}
              </div>
            ) : null}
          </section>

          <section>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-muted">
              Progres tahap pipeline
            </p>
            {stage === "batal" ? (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] leading-relaxed text-red-700">
                <IconBan size={17} className="mt-0.5 shrink-0" />
                <span>
                  Pengajuan berada di tahap <strong className="font-bold">Batal</strong>.
                  {inquiry.sellerNote ? ` Alasan: ${inquiry.sellerNote}` : ""}
                </span>
              </div>
            ) : (
              <ol className="grid grid-cols-6 gap-1 rounded-lg bg-ag-surface-low p-1.5 text-center">
                {PIPELINE_STEPS.map((step, index) => {
                  const active = index === stepIndex;
                  const passed = index < stepIndex;
                  return (
                    <li
                      key={step.key}
                      aria-current={active ? "step" : undefined}
                      className={[
                        "flex min-w-0 flex-col items-center rounded px-0.5 py-1 text-[9.5px]",
                        active
                          ? "bg-ag-forest font-bold text-white shadow-sm"
                          : passed
                            ? "text-ag-slate-secondary"
                            : "text-ag-slate-muted",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden="true"
                        className={[
                          "mb-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px]",
                          active
                            ? "bg-ag-gold-base text-ag-forest"
                            : passed
                              ? "bg-white text-ag-forest"
                              : "bg-white/60 text-ag-slate-muted",
                        ].join(" ")}
                      >
                        {active ? "•" : index + 1}
                      </span>
                      <span className="truncate">{step.short}</span>
                    </li>
                  );
                })}
              </ol>
            )}
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ag-slate-muted">
              Tahap diturunkan dari status pengajuan dan status unit, bukan status baru.
            </p>
          </section>

          <FollowUpForm
            key={`${inquiry.id}-${inquiry.status}`}
            inquiry={inquiry}
            actions={actions}
            hasPreview={Boolean(draft)}
            onPreview={onPreview}
            onClose={onClose}
          />

          <section className="border-t border-ag-line/70 pt-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-muted">
                Status unit
              </p>
              {saleMeta ? (
                <StatusBadge label={saleMeta.label} tone={saleMeta.tone} dot />
              ) : null}
            </div>

            {property?.listingStatus !== "VERIFIED" ? (
              <p className="rounded-tag bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-800">
                Status unit hanya bisa diubah untuk listing berstatus <strong>Terverifikasi</strong>.
                Penjual tidak memverifikasi listing sendiri.
              </p>
            ) : saleOptions.length === 0 ? (
              <p className="rounded-tag bg-slate-100 px-3 py-2 text-[12px] leading-relaxed text-slate-700">
                {property?.saleStatus === "SOLD"
                  ? "Unit sudah terjual; status ketersediaan tidak bisa diubah lagi."
                  : "Belum ada perubahan status unit yang sah dari kondisi sekarang."}
              </p>
            ) : (
              <>
                <p className="mb-2 text-[12px] leading-relaxed text-ag-slate-secondary">
                  {inquiry.status === "COMPLETED"
                    ? "Pilih status kaveling yang sesuai, lalu terapkan sebagai pratinjau. Papan belum mengubah Masterplan GIS."
                    : "Selesaikan kunjungan lebih dulu, lalu tandai unit dipesan atau terjual. Perubahan tetap berupa pratinjau dan belum mengubah Masterplan GIS."}
                </p>
                <ActionButton
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={openSaleModal}
                  disabled={inquiry.status !== "COMPLETED"}
                >
                  <IconCheckCircle size={16} />
                  Perbarui status unit
                </ActionButton>
                {saleDraft ? (
                  <p className="mt-1.5 text-[10.5px] text-ag-slate-muted">
                    Pratinjau status unit aktif di layar ini.
                  </p>
                ) : null}
              </>
            )}
          </section>

          <section className="border-t border-ag-line/70 pt-4">
            <p className="mb-3 text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-muted">
              Riwayat aktivitas
            </p>
            <ol className="relative ml-1 space-y-3 border-l border-ag-line pl-3.5">
              <TimelineItem
                tone="gold"
                title="Pengajuan masuk"
                body={`Pengajuan ${labelOf(
                  { VISIT: { label: "kunjungan" }, INTEREST: { label: "minat beli" } },
                  inquiry.type,
                )} diterima melalui Portal Web GIS SANG Group.`}
                meta={formatDateTime(inquiry.createdAt)}
              />
              {inquiry.scheduledAt ? (
                <TimelineItem
                  tone="blue"
                  title="Jadwal kunjungan"
                  body={`Jadwal yang tercatat: ${formatDateTime(inquiry.scheduledAt)}.`}
                />
              ) : null}
              {inquiry.sellerNote ? (
                <TimelineItem
                  tone={draft ? "gold" : "muted"}
                  title={draft ? "Catatan pratinjau" : "Catatan agen"}
                  body={inquiry.sellerNote}
                />
              ) : null}
              {draft ? (
                <TimelineItem
                  tone="gold"
                  title="Pratinjau perubahan"
                  body={`Status di layar menjadi ${labelOf(INQUIRY_STATUS, draft.next)}. Belum tersimpan ke database.`}
                />
              ) : null}
            </ol>
          </section>
        </div>
      </aside>

      {saleOpen ? (
        <Modal
          open
          onClose={() => setSaleOpen(false)}
          title="Konfirmasi Transaksi Deal"
          description={`${inquiry.buyer.name} · ${inquiry.property.title}`}
          footer={
            <>
              <ActionButton variant="outline" size="md" onClick={() => setSaleOpen(false)}>
                Batal
              </ActionButton>
              <ActionButton
                variant="forest"
                size="md"
                onClick={applySale}
                disabled={!saleTarget}
              >
                Terapkan pratinjau
              </ActionButton>
            </>
          }
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-ag-surface-low px-3 py-2.5">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-ag-available"
              >
                <IconCheckCircle size={20} />
              </span>
              <p className="text-[12.5px] leading-relaxed text-ag-slate-secondary">
                Pengajuan sudah selesai. Pilih status kaveling yang akan diterapkan pada pratinjau
                Masterplan GIS. Tidak ada perubahan yang disimpan ke database pada mode demo.
              </p>
            </div>

            <fieldset className="space-y-2">
              <legend className="mb-1 text-[12px] font-semibold text-ag-slate">
                Status unit baru
              </legend>
              {saleOptions.map((option) => (
                <label
                  key={option}
                  className={[
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    saleTarget === option
                      ? "border-ag-gold-base bg-ag-gold/5"
                      : "border-ag-line bg-ag-ivory-surface hover:border-ag-gold/50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="sale-status"
                    value={option}
                    checked={saleTarget === option}
                    onChange={() => setSaleTarget(option)}
                    className="mt-0.5 accent-[#0d3b2e]"
                  />
                  <span>
                    <span className="block text-[12.5px] font-bold text-ag-slate">
                      {labelOf(SALE_STATUS, option)}
                    </span>
                    <span className="block text-[11.5px] leading-relaxed text-ag-slate-secondary">
                      {SALE_CHOICE_DESCRIPTION[option] ?? "Perbarui status ketersediaan unit."}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>

            <p className="text-[11px] leading-relaxed text-ag-slate-muted">
              Hanya listing terverifikasi yang bisa berpindah status, dan urutan yang sah adalah
              Tersedia → Dipesan → Terjual (SRS §6.8).
            </p>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

function FollowUpForm({ inquiry, actions, hasPreview, onPreview, onClose }) {
  const toast = useToast();
  const [next, setNext] = useState(actions[0] ?? "");
  const [note, setNote] = useState(inquiry.sellerNote ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [error, setError] = useState("");

  if (actions.length === 0) {
    return (
      <section className="rounded-xl bg-ag-surface-low/60 p-4">
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-ag-slate-muted">
          Form tindak lanjut agen
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ag-slate-secondary">
          Tidak ada transisi pengajuan yang tersisa dari status{" "}
          <strong className="font-semibold text-ag-slate">
            {labelOf(INQUIRY_STATUS, inquiry.status)}
          </strong>
          .{" "}
          {inquiry.status === "COMPLETED"
            ? "Langkah berikutnya adalah status unit di bagian bawah panel."
            : "Pengajuan ini sudah ditutup."}
        </p>
      </section>
    );
  }

  const needsSchedule = next === "RESCHEDULED" || next === "CONFIRMED";
  const scheduledAt = date ? `${date}T${time || "09:00"}:00+07:00` : null;

  function save() {
    const result = validateFollowUp({ next, note, scheduledAt });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    const fallbackSchedule = scheduledAt ?? inquiry.scheduledAt ?? null;
    if (next === "CONFIRMED" && !fallbackSchedule) {
      setError("Konfirmasi jadwal wajib menyebut tanggal kunjungan.");
      return;
    }

    onPreview({
      next,
      note: result.note,
      scheduledAt: fallbackSchedule,
    });
    toast.push(
      `Pratinjau: ${actionMeta(next).label.toLowerCase()} untuk ${inquiry.buyer.name}. Belum tersimpan ke database.`,
      "info",
    );
    onClose();
  }

  return (
    <section className="space-y-3 rounded-xl border border-ag-line bg-ag-ivory-surface p-4">
      <div>
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-ag-forest">
          Form tindak lanjut agen
        </p>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-ag-slate-secondary">
          Hanya transisi yang sah yang ditampilkan. Setiap tindakan wajib punya catatan.
        </p>
      </div>

      <div>
        <label htmlFor="deal-next-status" className="mb-1 block text-[11.5px] font-semibold text-ag-slate">
          Status tindak lanjut
        </label>
        <select
          id="deal-next-status"
          value={next}
          onChange={(event) => {
            setNext(event.target.value);
            setError("");
          }}
          className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[12.5px] text-ag-slate outline-none focus:border-ag-gold-base"
        >
          {actions.map((action) => (
            <option key={action} value={action}>
              {actionMeta(action).label}
            </option>
          ))}
        </select>
      </div>

      {needsSchedule ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="deal-date" className="mb-1 block text-[11.5px] font-semibold text-ag-slate">
              Tanggal kunjungan
              {next === RESCHEDULE_STATUS ? <span className="text-red-600"> *</span> : null}
            </label>
            <input
              id="deal-date"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setError("");
              }}
              className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[12.5px] text-ag-slate outline-none focus:border-ag-gold-base"
            />
          </div>
          <div>
            <label htmlFor="deal-time" className="mb-1 block text-[11.5px] font-semibold text-ag-slate">
              Jam
            </label>
            <input
              id="deal-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[12.5px] text-ag-slate outline-none focus:border-ag-gold-base"
            />
          </div>
        </div>
      ) : null}

      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label htmlFor="deal-note" className="text-[11.5px] font-semibold text-ag-slate">
            Catatan tindak lanjut
          </label>
          <span className="text-[10.5px] text-ag-slate-muted">
            {note.length}/{FOLLOW_UP_NOTE_MAX}
          </span>
        </div>
        <textarea
          id="deal-note"
          rows={3}
          maxLength={FOLLOW_UP_NOTE_MAX}
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setError("");
          }}
          placeholder="Tuliskan hasil komunikasi WhatsApp atau instruksi penanganan."
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "deal-note-error" : undefined}
          className={[
            "w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-[12.5px] leading-relaxed text-ag-slate outline-none",
            error ? "border-red-400 focus:border-red-500" : "border-ag-line focus:border-ag-gold-base",
          ].join(" ")}
        />
        {error ? (
          <p id="deal-note-error" role="alert" className="mt-1 text-[11px] font-semibold text-red-600">
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={save}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-ag-gold-base px-3 py-2.5 text-[12.5px] font-bold text-ag-forest shadow-sm transition-colors hover:bg-ag-gold-muted"
      >
        <IconCheckCircle size={17} />
        Simpan tindak lanjut (pratinjau)
      </button>

      {hasPreview ? (
        <p className="text-[10.5px] text-ag-slate-muted">
          Pratinjau sebelumnya sudah tampil di papan; simpan lagi untuk menggantinya.
        </p>
      ) : null}
    </section>
  );
}

function TimelineItem({ tone = "muted", title, body, meta }) {
  const dot =
    tone === "gold" ? "bg-ag-gold-base" : tone === "blue" ? "bg-blue-500" : "bg-ag-slate-muted";

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={`absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full ${dot}`}
      />
      <p className="text-[11px] font-bold text-ag-slate-secondary">{title}</p>
      <p className="mt-0.5 text-[12px] leading-relaxed text-ag-slate">{body}</p>
      {meta ? (
        <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-ag-slate-muted">
          <IconClock size={12} />
          {meta}
        </p>
      ) : null}
    </li>
  );
}
