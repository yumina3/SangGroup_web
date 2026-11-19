import Link from "next/link";

import {
  IconArrowRight,
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconHourglass,
} from "@/components/dashboard/icons";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/dashboard/format";
import {
  inquiryStatusMeta,
  inquiryTypeMeta,
} from "@/lib/dashboard/inquiry-status";
import { KONTAK } from "@/lib/site/kontak";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

function dateParts(value) {
  if (!value) return { month: "", day: "" };
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return { month: "", day: "" };

  const jakarta = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  );
  return {
    month: MONTHS[jakarta.getMonth()] ?? "",
    day: String(jakarta.getDate()).padStart(2, "0"),
  };
}

/**
 * Satu pengajuan kunjungan/minat beli milik pembeli.
 *
 * Tanggal pada kartu adalah tanggal pengajuan, bukan janji temu. Jadwal pasti
 * belum tersimpan di database, jadi pembeli diarahkan mengonfirmasi lewat
 * kontak resmi alih-alih menampilkan jam yang tidak akurat.
 */
export default function BuyerVisitCard({ inquiry }) {
  const status = inquiryStatusMeta(inquiry.status);
  const type = inquiryTypeMeta(inquiry.type);
  const { month, day } = dateParts(inquiry.createdAt);
  const isVisit = inquiry.type === "kunjungan";
  const agentNote = inquiry.scheduleNote || inquiry.history.at(-1)?.note;
  // Riwayat perubahan status hanya ditampilkan di halaman detail agar kartu
  // ringkasan di beranda akun tetap ringkas.
  const history = Array.isArray(inquiry.history) ? inquiry.history : [];
  const showHistory = history.length > 1;

  return (
    <article className="rounded-lg border border-brand-line bg-white p-5 shadow-sm transition-colors hover:border-brand-gold/50 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-brand-line pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md border border-brand-deep bg-brand-deep text-brand-gold"
          >
            <span className="text-[10px] font-bold uppercase leading-none tracking-wider">
              {month}
            </span>
            <span className="mt-1 text-xl font-extrabold leading-none tabular-nums">
              {day}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold leading-snug text-brand-ink">
                {isVisit ? "Kunjungan" : "Minat beli"} {inquiry.property.title}
              </h3>
              <StatusBadge label={type.label} tone={type.tone} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <IconCalendar size={14} className="text-brand-gold" />
                Diajukan {formatDate(inquiry.createdAt)}
              </span>
              <span>{inquiry.property.projectName}</span>
            </p>
          </div>
        </div>
        <StatusBadge
          label={status.label}
          tone={status.tone}
          dot
          className="self-start md:self-center"
        />
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
        {status.description}
      </p>

      {inquiry.message ? (
        <div className="mt-3 rounded-md border border-brand-line bg-brand-cream/50 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
            Pesan Anda
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-brand-ink">
            {inquiry.message}
          </p>
        </div>
      ) : null}

      {agentNote ? (
        <div className="mt-3 rounded-md border border-brand-line bg-brand-cream/50 p-3.5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
            {isVisit && inquiry.status === "kunjungan_dijadwalkan" ? (
              <IconCheckCircle size={13} className="text-brand-gold" />
            ) : (
              <IconHourglass size={13} className="text-brand-gold" />
            )}
            Catatan tim pemasaran
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-brand-ink">
            {agentNote}
          </p>
          <p className="mt-1 text-[10px] text-muted">
            Diperbarui {formatDateTime(inquiry.updatedAt)}
          </p>
        </div>
      ) : null}

      {showHistory ? (
        <details className="mt-3 rounded-md border border-brand-line bg-white px-3.5 py-3">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
            Riwayat status ({history.length})
          </summary>
          <ol className="mt-3 flex flex-col gap-3">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="border-l-2 border-brand-gold/40 pl-3 text-[11px] leading-relaxed"
              >
                <p className="font-semibold text-brand-ink">
                  {inquiryStatusMeta(entry.newStatus).label}
                </p>
                <p className="text-muted">
                  {formatDateTime(entry.createdAt)}
                  {entry.actorName ? ` · ${entry.actorName}` : ""}
                </p>
                {entry.note ? (
                  <p className="mt-0.5 text-brand-ink">{entry.note}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </details>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1.5 text-[10.5px] text-muted">
          <IconClock size={13} />
          Jam pasti janji temu dikonfirmasi lewat {KONTAK.channels[0]?.value}
        </p>
        <Link
          href="/kontak"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-brand-line px-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:border-brand-gold"
        >
          Konfirmasi ke Tim
          <IconArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}
