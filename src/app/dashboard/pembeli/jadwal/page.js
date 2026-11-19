import Link from "next/link";

import BuyerPageHeader from "@/components/dashboard/buyer/BuyerPageHeader";
import BuyerVisitCard from "@/components/dashboard/buyer/BuyerVisitCard";
import { IconArrowRight, IconCalendar } from "@/components/dashboard/icons";
import Alert from "@/components/ui/Alert";
import { requireRole } from "@/lib/auth/session";
import { isActiveInquiry } from "@/lib/dashboard/inquiry-status";
import { listBuyerInquiries } from "@/lib/properties/inquiries";

export const metadata = { title: "Jadwal Kunjungan" };

/** Halaman ini membaca sesi dan pengajuan pada setiap request. */
export const instant = false;

function EmptyState() {
  return (
    <section className="rounded-xl border border-brand-line bg-white px-6 py-12 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-brand-deep ring-1 ring-brand-line">
        <IconCalendar size={24} />
      </span>
      <h2 className="mt-4 text-[16px] font-bold text-brand-ink">
        Belum ada pengajuan kunjungan
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed text-muted">
        Ajukan survei show unit melalui halaman properti atau hubungi tim
        pemasaran. Setiap pengajuan akan tampil di sini beserta status
        tindak lanjutnya.
      </p>
      <Link
        href="/kontak"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-deep px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
      >
        Hubungi Tim
        <IconArrowRight size={15} />
      </Link>
    </section>
  );
}

export default async function BuyerSchedulePage() {
  const profile = await requireRole("buyer", "/dashboard/pembeli/jadwal");
  const result = await listBuyerInquiries(profile.id);
  const inquiries = result.ok ? result.inquiries : [];
  const visits = inquiries.filter((item) => item.type === "kunjungan");
  const activeCount = visits.filter((item) => isActiveInquiry(item.status)).length;

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        icon={IconCalendar}
        eyebrow="Akun pembeli"
        title="Jadwal Kunjungan & Survei"
        description="Setiap pengajuan kunjungan yang Anda kirim ke tim pemasaran, lengkap dengan status dan catatan tindak lanjut. Jam pasti janji temu dikonfirmasi lewat kontak resmi."
        counterLabel="Kunjungan"
        counterValue={result.ok ? visits.length : "—"}
        primary={{ href: "/kontak", label: "Ajukan Kunjungan" }}
      />

      {!result.ok ? (
        <Alert
          tone={result.code === "db_not_configured" ? "info" : "danger"}
          title={
            result.code === "db_not_configured"
              ? "Pengajuan belum tersambung"
              : "Pengajuan gagal dimuat"
          }
        >
          {result.code === "db_not_configured"
            ? "Database pengajuan belum dikonfigurasi. Hubungi admin SANG Group untuk bantuan."
            : "Terjadi kendala saat memuat pengajuan Anda. Muat ulang halaman ini untuk mencoba lagi."}
        </Alert>
      ) : visits.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand-line bg-brand-cream/50 px-4 py-3 text-[11.5px] text-muted">
            <p>
              <span className="font-bold text-brand-deep">{activeCount}</span>{" "}
              pengajuan masih berjalan dari{" "}
              <span className="font-bold text-brand-deep">{visits.length}</span>{" "}
              total pengajuan.
            </p>
            <Link
              href="/sang-dipa#spesifikasi"
              className="inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.08em] text-brand-deep no-underline hover:text-brand-gold"
            >
              Lihat Unit
              <IconArrowRight size={13} />
            </Link>
          </div>

          <ul className="flex flex-col gap-4">
            {visits.map((inquiry) => (
              <li key={inquiry.id}>
                <BuyerVisitCard inquiry={inquiry} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
