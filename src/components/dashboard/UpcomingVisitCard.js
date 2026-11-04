import { formatDateTime } from "@/lib/dashboard/format";

/**
 * Panel hijau "kunjungan terdekat" (FR-SEL-04 sisi penjual).
 * Tombol simpul menuju halaman yang mengerjakannya: pengajuan masuk dan
 * detail properti. Ajakan menghubungi pembeli memakai tautan WhatsApp;
 * percakapan lanjutan tersedia di halaman Pesan.
 */
export default function UpcomingVisitCard({ visit }) {
  if (!visit) {
    return (
      <section className="flex flex-col justify-between rounded-dash bg-ag-forest p-5 text-white">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ag-gold-light">
          Kunjungan Terdekat
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-white/85">
          Belum ada jadwal kunjungan mendatang dari calon pembeli.
        </p>
      </section>
    );
  }

  const waNumber = visit.buyer.phone.replace(/\D/g, "");

  return (
    <section className="flex flex-col justify-between rounded-dash bg-ag-forest p-5 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ag-gold-light">
          Kunjungan Terdekat
        </p>
        <span className="rounded-tag bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/90">
          Survei lapangan
        </span>
      </div>

      <p className="mb-1.5 text-[15px] font-bold">{formatDateTime(visit.scheduledAt)}</p>
      <p className="mb-1 text-[14px] font-semibold text-ag-gold-light">
        {visit.buyer.name} · {visit.property.title}
      </p>
      {visit.message ? (
        <p className="text-[12px] leading-relaxed text-white/70">{visit.message}</p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 pt-4">
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-dash bg-ag-gold px-3 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-ag-gold-light hover:text-ag-slate"
        >
          WhatsApp
        </a>
        <a
          href="/dashboard/penjual/pengajuan"
          className="flex items-center justify-center gap-1.5 rounded-dash border border-white/30 px-3 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
        >
          Lihat pengajuan
        </a>
      </div>
    </section>
  );
}
