import Link from "next/link";

import BuyerPageHeader from "@/components/dashboard/buyer/BuyerPageHeader";
import BuyerVisitCard from "@/components/dashboard/buyer/BuyerVisitCard";
import {
  IconArrowRight,
  IconCheckCircle,
  IconHelp,
} from "@/components/dashboard/icons";
import Alert from "@/components/ui/Alert";
import { requireRole } from "@/lib/auth/session";
import {
  ACTIVE_INQUIRY_STATUSES,
  isActiveInquiry,
} from "@/lib/dashboard/inquiry-status";
import { listBuyerInquiries } from "@/lib/properties/inquiries";

export const metadata = { title: "Status Minat Beli" };

/** Halaman ini membaca sesi dan pengajuan pada setiap request. */
export const instant = false;

const STAGES = [
  {
    status: "menunggu",
    label: "Pengajuan diterima",
    description: "Tim pemasaran meninjau unit dan data yang Anda kirim.",
  },
  {
    status: "dihubungi",
    label: "Dihubungi agen",
    description: "Agen menghubungi Anda untuk preferensi unit dan pembiayaan.",
  },
  {
    status: "kunjungan_dijadwalkan",
    label: "Kunjungan dijadwalkan",
    description: "Anda dijadwalkan melihat unit atau berdiskusi langsung.",
  },
  {
    status: "selesai",
    label: "Tindak lanjut selesai",
    description: "Tim mencatat pengajuan Anda sebagai sudah ditindaklanjuti.",
  },
];

function EmptyState() {
  return (
    <section className="rounded-xl border border-brand-line bg-white px-6 py-12 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-brand-deep ring-1 ring-brand-line">
        <IconCheckCircle size={24} />
      </span>
      <h2 className="mt-4 text-[16px] font-bold text-brand-ink">
        Belum ada pengajuan minat beli
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed text-muted">
        Simpan unit favorit lalu ajukan minat melalui tim pemasaran. Status
        setiap pengajuan akan tampil di halaman ini.
      </p>
      <Link
        href="/sang-dipa#spesifikasi"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-deep px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
      >
        Jelajahi Properti
        <IconArrowRight size={15} />
      </Link>
    </section>
  );
}

export default async function BuyerStatusPage() {
  const profile = await requireRole("buyer", "/dashboard/pembeli/status");
  const result = await listBuyerInquiries(profile.id);
  const inquiries = result.ok ? result.inquiries : [];
  const interests = inquiries.filter((item) => item.type === "minat_beli");
  const activeCount = interests.filter((item) =>
    isActiveInquiry(item.status),
  ).length;
  const currentStage = interests
    .map((item) => ACTIVE_INQUIRY_STATUSES.indexOf(item.status))
    .filter((index) => index >= 0)
    .sort((a, b) => b - a)[0];

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        icon={IconCheckCircle}
        eyebrow="Akun pembeli"
        title="Status Minat Beli"
        description="Pantau tahap tindak lanjut setiap pengajuan minat beli Anda. Riwayat perubahan status berasal langsung dari catatan tim pemasaran."
        counterLabel="Minat aktif"
        counterValue={result.ok ? activeCount : "—"}
        primary={{ href: "/kontak", label: "Lanjutkan Diskusi" }}
      />

      <section
        aria-labelledby="judul-tahapan"
        className="rounded-xl border border-brand-line bg-white p-6 shadow-sm sm:p-8"
      >
        <h2
          id="judul-tahapan"
          className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-ink"
        >
          Tahapan tindak lanjut
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage, index) => {
            const reached =
              typeof currentStage === "number" && index <= currentStage;

            return (
              <li
                key={stage.status}
                className={`rounded-lg border p-4 ${
                  reached
                    ? "border-brand-gold/60 bg-brand-cream/60"
                    : "border-brand-line bg-white"
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${
                    reached
                      ? "bg-brand-deep text-brand-gold"
                      : "bg-brand-cream text-muted ring-1 ring-brand-line"
                  }`}
                >
                  {index + 1}
                </span>
                <p className="mt-2 text-[12.5px] font-bold text-brand-ink">
                  {stage.label}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  {stage.description}
                </p>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 flex items-start gap-2 rounded-md border border-brand-line bg-brand-cream/40 px-3.5 py-3 text-[11px] leading-relaxed text-muted">
          <IconHelp size={14} className="mt-0.5 shrink-0 text-brand-gold" />
          Progres KPR dan legalitas belum tersedia di sistem. Sampaikan
          pertanyaan pembiayaan atau dokumen kepada tim pemasaran lewat kontak
          resmi.
        </p>
      </section>

      {!result.ok ? (
        <Alert
          tone={result.code === "db_not_configured" ? "info" : "danger"}
          title="Status minat belum tersedia"
        >
          {result.code === "db_not_configured"
            ? "Database pengajuan belum dikonfigurasi. Hubungi admin SANG Group untuk bantuan."
            : "Terjadi kendala saat memuat pengajuan Anda. Muat ulang halaman ini untuk mencoba lagi."}
        </Alert>
      ) : interests.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-4">
          {interests.map((inquiry) => (
            <li key={inquiry.id}>
              <BuyerVisitCard inquiry={inquiry} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
