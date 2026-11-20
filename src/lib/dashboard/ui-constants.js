/**
 * Konstanta tampilan dashboard agen yang aman dipakai Client Component.
 *
 * File ini sengaja tidak mengimpor modul server (Prisma, Supabase, Redis, dll).
 * Modul data seperti `agent-data.js` dan `contact-data.js` mengimpor konstanta
 * dari sini lalu mengekspornya kembali, sehingga komponen klien cukup membaca
 * file ini tanpa menarik rantai modul `server-only` ke bundle browser.
 */

/** Kategori yang tersedia di form properti (dipakai komponen klien). */
export const AGENT_CATEGORY_OPTIONS = ["Rumah", "Ruko", "Kavling", "Apartemen"];

export const CONTACT_STATUS = {
  BARU: { label: "Baru", tone: "warning" },
  KONSULTASI: { label: "Konsultasi", tone: "info" },
  DIJADWALKAN: { label: "Dijadwalkan", tone: "info" },
  NEGOSIASI: { label: "Negosiasi", tone: "gold" },
  DEAL: { label: "Deal", tone: "success" },
  SELESAI: { label: "Selesai", tone: "neutral" },
  BATAL: { label: "Batal", tone: "danger" },
};

const FILTER_STATUS = ["BARU", "KONSULTASI", "DIJADWALKAN", "NEGOSIASI", "DEAL", "BATAL"];

export const CONTACT_STATUS_OPTIONS = [
  { value: "ALL", label: "Semua Status" },
  ...FILTER_STATUS.map((key) => ({ value: key, label: CONTACT_STATUS[key].label })),
];

/** Waktu sinkronisasi contoh. Nanti diisi waktu query terakhir ke database. */
export const CONTACT_LAST_SYNC = "2026-11-04T02:45:00.000Z";

export const TASK_TYPES = {
  CONTACT: { label: "Hubungi", tone: "success" },
  VISIT: { label: "Kunjungan", tone: "warning" },
  DOCUMENT: { label: "Dokumen", tone: "info" },
};

export const MESSAGE_QUICK_REPLIES = [
  {
    id: "jadwal",
    label: "Jadwalkan kunjungan",
    text: "Baik, jadwal kunjungan sudah kami catat. Tim marketing gallery akan menyiapkan denah dan simulasi KPR.",
  },
  {
    id: "brosur",
    label: "Kirim brosur",
    text: "Berikut kami lampirkan e-brosur resmi kawasan beserta spesifikasi material unit yang Anda minati.",
  },
  {
    id: "anggaran",
    label: "Tanya anggaran",
    text: "Berapa estimasi alokasi DP dan target tenor cicilan KPR yang Anda prioritaskan?",
  },
];

export const ANALYTICS_PERIODS = [
  { value: "month", label: "Bulan Ini (Okt 2026)" },
  { value: "quarter", label: "3 Bulan Terakhir" },
  { value: "year", label: "Tahun Ini (2026)" },
];
