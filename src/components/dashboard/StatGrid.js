import StatCard from "@/components/dashboard/StatCard";
import { formatNumber, formatRupiahShort } from "@/lib/dashboard/format";

/**
 * Deretan empat kartu KPI ringkasan: total listing, menunggu verifikasi,
 * pengajuan aktif, dan properti terjual. Semua nilai berasal dari
 * `summarize()` supaya sama dengan daftar (SRS-N-DAT-07).
 */
export default function StatGrid({ summary, upcomingVisitLabel }) {
  const cards = [
    {
      label: "Total Listing",
      value: formatNumber(summary.totalProperties),
      unit: "properti",
      footnote: "Seluruh listing milik Anda, semua status.",
      icon: "Total",
      tone: "forest",
    },
    {
      label: "Menunggu Verifikasi",
      value: formatNumber(summary.pendingVerification),
      unit: "listing",
      footnote:
        summary.pendingVerification > 0
          ? "Belum tampil di katalog sampai admin menyetujui."
          : "Tidak ada listing yang menunggu admin.",
      icon: "Antre",
      tone: "warning",
    },
    {
      label: "Pengajuan Aktif",
      value: formatNumber(summary.activeInquiries),
      unit: "pengajuan",
      footnote: upcomingVisitLabel,
      icon: "Masuk",
      tone: "info",
    },
    {
      label: "Properti Terjual",
      value: formatNumber(summary.soldProperties),
      unit: "unit",
      footnote:
        summary.soldProperties > 0
          ? `Nilai tercatat ${formatRupiahShort(summary.soldValue)}.`
          : "Belum ada unit terjual.",
      icon: "Laku",
      tone: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
