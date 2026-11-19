/**
 * Label status pengajuan pembeli.
 *
 * Database memakai enum `InquiryStatus` berbahasa Indonesia. Badge dashboard
 * memakai kode status agen (PENDING/CONFIRMED/...), jadi pemetaan ini menjaga
 * satu sumber label dan nada warna untuk portal pembeli.
 */

const STATUS_META = {
  menunggu: {
    label: "Menunggu konfirmasi",
    tone: "warning",
    description:
      "Tim pemasaran sedang meninjau pengajuan Anda dan akan menghubungi Anda.",
  },
  dihubungi: {
    label: "Sudah dihubungi",
    tone: "info",
    description:
      "Agen sudah menghubungi Anda. Sampaikan pertanyaan atau preferensi jadwal bila perlu.",
  },
  kunjungan_dijadwalkan: {
    label: "Kunjungan dijadwalkan",
    tone: "info",
    description:
      "Jadwal kunjungan sudah dikonfirmasi tim pemasaran. Konfirmasi ulang melalui kontak resmi bila ada perubahan.",
  },
  selesai: {
    label: "Selesai",
    tone: "success",
    description: "Pengajuan sudah ditindaklanjuti tim pemasaran.",
  },
  dibatalkan: {
    label: "Dibatalkan",
    tone: "neutral",
    description: "Pengajuan dibatalkan. Anda dapat mengajukan kunjungan baru.",
  },
  ditolak: {
    label: "Ditolak",
    tone: "danger",
    description:
      "Pengajuan tidak dapat diproses. Hubungi tim pemasaran untuk pilihan unit lain.",
  },
};

const TYPE_META = {
  kunjungan: { label: "Kunjungan", tone: "gold" },
  minat_beli: { label: "Minat beli", tone: "info" },
};

export function inquiryStatusMeta(status) {
  return (
    STATUS_META[status] ?? {
      label: status || "Tidak diketahui",
      tone: "neutral",
      description: "Hubungi tim pemasaran untuk keterangan lebih lanjut.",
    }
  );
}

export function inquiryTypeMeta(type) {
  return TYPE_META[type] ?? { label: "Pengajuan", tone: "neutral" };
}

/** Pengajuan yang masih berjalan (belum selesai/batal/ditolak). */
export const ACTIVE_INQUIRY_STATUSES = [
  "menunggu",
  "dihubungi",
  "kunjungan_dijadwalkan",
];

export function isActiveInquiry(status) {
  return ACTIVE_INQUIRY_STATUSES.includes(status);
}
