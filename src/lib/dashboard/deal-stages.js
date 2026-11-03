/**
 * Tahap pipeline penjual.
 *
 * Papan memakai tujuh kolom seperti desain, tetapi tahapnya **diturunkan**
 * dari status pengajuan SRS (`INQUIRY_STATUS`) dan status ketersediaan unit.
 * Tidak ada status baru yang disimpan: `dealStageOf()` hanya membaca data
 * yang sudah ada sehingga papan tidak bisa menampilkan transisi yang tidak
 * sah (SRS §6.8).
 */

/**
 * @typedef {"baru"|"konsultasi"|"dijadwalkan"|"selesai"|"negosiasi"|"deal"|"batal"} DealStageKey
 */

/** @type {Array<{ key: DealStageKey, label: string, short: string, dot: string, border: string, tone: string }>} */
export const DEAL_STAGES = [
  {
    key: "baru",
    label: "Baru",
    short: "Baru",
    dot: "bg-slate-400",
    border: "border-l-slate-300",
    tone: "neutral",
  },
  {
    key: "konsultasi",
    label: "Konsultasi",
    short: "Konsul",
    dot: "bg-ag-gold-base",
    border: "border-l-ag-gold-base",
    tone: "gold",
  },
  {
    key: "dijadwalkan",
    label: "Dijadwalkan",
    short: "Jadwal",
    dot: "bg-blue-500",
    border: "border-l-blue-500",
    tone: "info",
  },
  {
    key: "selesai",
    label: "Selesai Kunjungan",
    short: "Selesai",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    tone: "success",
  },
  {
    key: "negosiasi",
    label: "Negosiasi",
    short: "Nego",
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    tone: "warning",
  },
  {
    key: "deal",
    label: "Deal",
    short: "Deal",
    dot: "bg-ag-forest",
    border: "border-l-ag-forest",
    tone: "success",
  },
  {
    key: "batal",
    label: "Batal",
    short: "Batal",
    dot: "bg-red-500",
    border: "border-l-red-500",
    tone: "danger",
  },
];

/** Enam langkah stepper di panel detail; "Batal" ditampilkan terpisah. */
export const PIPELINE_STEPS = DEAL_STAGES.filter((stage) => stage.key !== "batal");

export function stageMeta(key) {
  return DEAL_STAGES.find((stage) => stage.key === key) ?? DEAL_STAGES[0];
}

/**
 * Tahap papan untuk satu pengajuan.
 *
 * Urutan pemeriksaan disengaja: status akhir (batal/deal/selesai) lebih dulu,
 * lalu jadwal, lalu jenis pengajuan. Dengan begitu satu pengajuan tidak
 * pernah muncul di dua kolom.
 *
 * @param {object} inquiry
 * @param {{ saleStatus?: string } | null | undefined} property
 * @returns {DealStageKey}
 */
export function dealStageOf(inquiry, property) {
  if (!inquiry) return "baru";

  if (inquiry.status === "REJECTED" || inquiry.status === "CANCELLED") return "batal";

  if (inquiry.status === "COMPLETED") {
    if (property?.saleStatus === "BOOKED" || property?.saleStatus === "SOLD") return "deal";
    return "selesai";
  }

  if (inquiry.status === "CONFIRMED" || inquiry.status === "RESCHEDULED") {
    return "dijadwalkan";
  }

  if (inquiry.type === "INTEREST" && typeof inquiry.offerPrice === "number") {
    return "negosiasi";
  }

  if (inquiry.status === "PENDING" && inquiry.sellerNote) return "konsultasi";

  return "baru";
}

/** Indeks tahap pada stepper; -1 untuk Batal. */
export function pipelineStepIndex(stage) {
  return PIPELINE_STEPS.findIndex((step) => step.key === stage);
}

/** Nilai transaksi yang dipakai di ringkasan dan CSV. */
export function dealValueOf(inquiry, property) {
  if (typeof inquiry?.offerPrice === "number") return inquiry.offerPrice;
  if (typeof property?.price === "number") return property.price;
  return inquiry?.property?.price ?? 0;
}

/**
 * Label aksi tindak lanjut dalam bahasa papan, bukan nama enum.
 * Kunci mengikuti `SELLER_INQUIRY_ACTIONS`.
 */
export const INQUIRY_ACTION_META = {
  CONFIRMED: {
    label: "Konfirmasi jadwal",
    description: "Pembeli menerima jadwal kunjungan yang disepakati.",
    placeholder: "Konfirmasi jadwal dan apa yang perlu pembeli bawa.",
  },
  RESCHEDULED: {
    label: "Jadwalkan ulang",
    description: "Usulkan tanggal dan jam kunjungan baru.",
    placeholder: "Tuliskan alasan jadwal ulang dan hal yang perlu pembeli siapkan.",
  },
  COMPLETED: {
    label: "Selesaikan kunjungan",
    description: "Kunjungan selesai; catat hasilnya untuk pembeli.",
    placeholder: "Ringkas hasil kunjungan atau kesepakatan dengan pembeli.",
  },
  REJECTED: {
    label: "Tandai batal",
    description: "Pengajuan ditutup dengan alasan tertulis.",
    placeholder: "Jelaskan alasan pembatalan dengan sopan.",
  },
};

export function actionMeta(next) {
  return (
    INQUIRY_ACTION_META[next] ?? {
      label: "Tindak lanjut",
      description: "Perbarui status pengajuan.",
      placeholder: "Tuliskan catatan tindak lanjut.",
    }
  );
}
