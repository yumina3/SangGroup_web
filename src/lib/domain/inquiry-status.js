/**
 * Status & matriks transisi pengajuan (SRS §7). Modul murni agar bisa diuji
 * tanpa database dan dipakai bersama service + UI.
 */

export const INQUIRY_STATUSES = [
  "menunggu",
  "dihubungi",
  "kunjungan_dijadwalkan",
  "selesai",
  "dibatalkan",
  "ditolak",
];

export const INQUIRY_STATUS_LABEL = {
  menunggu: "Menunggu",
  dihubungi: "Dihubungi",
  kunjungan_dijadwalkan: "Kunjungan dijadwalkan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  ditolak: "Ditolak",
};

/** Transisi yang diizinkan untuk agen/admin (pembatalan hanya oleh pembeli). */
export const INQUIRY_TRANSITIONS = {
  menunggu: ["dihubungi", "kunjungan_dijadwalkan", "ditolak", "dibatalkan"],
  dihubungi: ["kunjungan_dijadwalkan", "selesai", "ditolak", "dibatalkan"],
  kunjungan_dijadwalkan: ["selesai", "ditolak", "dibatalkan"],
  selesai: [],
  dibatalkan: [],
  ditolak: [],
};

export const ACTIVE_INQUIRY_STATUSES = ["menunggu", "dihubungi", "kunjungan_dijadwalkan"];
