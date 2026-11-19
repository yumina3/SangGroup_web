import Link from "next/link";

import {
  IconArrowRight,
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconMessage,
  IconUsers,
} from "@/components/dashboard/icons";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { formatDateTime } from "@/lib/dashboard/format";
import {
  inquiryStatusMeta,
  isActiveInquiry,
} from "@/lib/dashboard/inquiry-status";

function associatedAgent(inquiry) {
  const update = [...inquiry.history]
    .reverse()
    .find((item) => item.actorRole === "agent" && item.actorName);
  return update?.actorName ?? null;
}

/**
 * Tiga kartu kategori akun yang mengikuti struktur desain reference:
 * jadwal kunjungan, status minat beli, dan pesan advisor.
 *
 * Kartu ini murni ringkasan: isinya hanya pengajuan terakhir dan tautan ke
 * halaman detail (`/jadwal`, `/status`, `/pesan`). Pemecahan ke halaman
 * terpisah menjaga beranda akun tetap pendek.
 */
export default function BuyerTrackingCards({ inquiries = [] }) {
  const visits = inquiries.filter((item) => item.type === "kunjungan");
  const interests = inquiries.filter((item) => item.type === "minat_beli");
  const activeVisits = visits.filter((item) => isActiveInquiry(item.status));
  const activeInterests = interests.filter((item) =>
    isActiveInquiry(item.status),
  );
  const scheduled = visits.find(
    (item) => item.status === "kunjungan_dijadwalkan",
  );
  const latestVisit = visits[0] ?? null;
  const latestInterest = interests[0] ?? null;

  const visitAgent = latestVisit ? associatedAgent(latestVisit) : null;
  const interestAgent = latestInterest ? associatedAgent(latestInterest) : null;
  const latestVisitStatus = latestVisit
    ? inquiryStatusMeta(latestVisit.status)
    : null;
  const latestInterestStatus = latestInterest
    ? inquiryStatusMeta(latestInterest.status)
    : null;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <article className="flex h-full flex-col rounded-xl border border-brand-line bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-deep text-brand-gold">
              <IconCalendar size={19} />
            </span>
            <div>
              <h3 className="text-[13.5px] font-bold text-brand-ink">
                Jadwal Kunjungan
              </h3>
              <p className="text-[10.5px] text-muted">
                {visits.length} pengajuan kunjungan
              </p>
            </div>
          </div>
          {activeVisits.length > 0 ? (
            <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-[10px] font-bold tabular-nums text-brand-deep">
              {activeVisits.length} aktif
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex-1">
          {!latestVisit ? (
            <p className="text-[11.5px] leading-relaxed text-muted">
              Belum ada pengajuan kunjungan. Ajukan survei show unit melalui
              halaman properti atau hubungi tim pemasaran.
            </p>
          ) : (
            <>
              <p className="text-[12.5px] font-semibold leading-snug text-brand-ink">
                {latestVisit.property.title}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {latestVisit.property.projectName}
              </p>
              <div className="mt-2.5">
                <StatusBadge
                  label={latestVisitStatus.label}
                  tone={latestVisitStatus.tone}
                  dot
                />
              </div>
              {scheduled ? (
                <p className="mt-2.5 inline-flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
                  <IconCheckCircle
                    size={13}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />
                  Jadwal dikonfirmasi {formatDateTime(scheduled.updatedAt)}
                </p>
              ) : (
                <p className="mt-2.5 inline-flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
                  <IconClock
                    size={13}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />
                  Diajukan {formatDateTime(latestVisit.createdAt)}
                </p>
              )}
              {visitAgent ? (
                <p className="mt-1.5 text-[10.5px] text-muted">
                  Ditangani {visitAgent}
                </p>
              ) : null}
            </>
          )}
        </div>

        <Link
          href="/dashboard/pembeli/jadwal"
          className="mt-4 inline-flex items-center gap-1.5 border-t border-brand-line pt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:text-brand-gold"
        >
          Buka jadwal kunjungan
          <IconArrowRight size={13} />
        </Link>
      </article>

      <article className="flex h-full flex-col rounded-xl border border-brand-line bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-deep text-brand-gold">
              <IconCheckCircle size={19} />
            </span>
            <div>
              <h3 className="text-[13.5px] font-bold text-brand-ink">
                Status Minat Beli
              </h3>
              <p className="text-[10.5px] text-muted">
                {interests.length} pengajuan minat
              </p>
            </div>
          </div>
          {activeInterests.length > 0 ? (
            <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-[10px] font-bold tabular-nums text-brand-deep">
              {activeInterests.length} aktif
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex-1">
          {!latestInterest ? (
            <p className="text-[11.5px] leading-relaxed text-muted">
              Belum ada pengajuan minat beli. Simpan properti favorit lalu
              ajukan minat lewat halaman properti.
            </p>
          ) : (
            <>
              <p className="text-[12.5px] font-semibold leading-snug text-brand-ink">
                {latestInterest.property.title}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {latestInterest.property.projectName}
              </p>
              <div className="mt-2.5">
                <StatusBadge
                  label={latestInterestStatus.label}
                  tone={latestInterestStatus.tone}
                  dot
                />
              </div>
              <p className="mt-2.5 inline-flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
                <IconClock
                  size={13}
                  className="mt-0.5 shrink-0 text-brand-gold"
                />
                Diperbarui {formatDateTime(latestInterest.updatedAt)}
              </p>
              {interestAgent ? (
                <p className="mt-1.5 text-[10.5px] text-muted">
                  Ditangani {interestAgent}
                </p>
              ) : null}
            </>
          )}
        </div>

        <Link
          href="/dashboard/pembeli/status"
          className="mt-4 inline-flex items-center gap-1.5 border-t border-brand-line pt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:text-brand-gold"
        >
          Lihat status pengajuan
          <IconArrowRight size={13} />
        </Link>
      </article>

      <article className="flex h-full flex-col rounded-xl border border-brand-line bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-deep text-brand-gold">
              <IconMessage size={19} />
            </span>
            <div>
              <h3 className="text-[13.5px] font-bold text-brand-ink">
                Pesan Advisor
              </h3>
              <p className="text-[10.5px] text-muted">Kanal komunikasi resmi</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex-1">
          {latestVisit || latestInterest ? (
            <p className="inline-flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted">
              <IconUsers
                size={14}
                className="mt-0.5 shrink-0 text-brand-gold"
              />
              Advisor yang menangani pengajuan Anda dapat dihubungi melalui
              telepon atau formulir kontak untuk jadwal dan tindak lanjut.
            </p>
          ) : (
            <p className="text-[11.5px] leading-relaxed text-muted">
              Belum ada advisor yang ditugaskan. Ajukan kunjungan atau minat
              beli agar tim pemasaran mendampingi Anda.
            </p>
          )}
          <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
            Obrolan langsung di akun belum tersedia; riwayat percakapan contoh
            tidak ditampilkan.
          </p>
        </div>

        <Link
          href="/dashboard/pembeli/pesan"
          className="mt-4 inline-flex items-center gap-1.5 border-t border-brand-line pt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:text-brand-gold"
        >
          Buka pesan & konsultasi
          <IconArrowRight size={13} />
        </Link>
      </article>
    </div>
  );
}
