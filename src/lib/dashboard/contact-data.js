/**
 * Data demo halaman Kontak dashboard agen.
 *
 * Bentuk data dibuat sama dengan yang nanti dihasilkan query database:
 * satu baris kontak berisi identitas calon pembeli, properti terakhir yang
 * diminati, status interaksi, dan riwayat aktivitas. Halaman Kontak dan Pesan
 * sama-sama membaca kontak dari sini supaya nama, nomor, dan properti tidak
 * berbeda antarhalaman.
 *
 * Saat modul database tersambung, `getAgentContacts()` cukup diganti query
 * Prisma yang dibatasi `sellerId` agen yang sedang login.
 */

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

/**
 * @typedef {object} AgentContact
 * @property {string} id
 * @property {string} buyerId
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {string} city
 * @property {string} source
 * @property {string} score
 * @property {"gold"|"info"|"success"|"neutral"|"danger"} scoreTone
 * @property {keyof typeof CONTACT_STATUS} status
 * @property {string} lastInteractionAt
 * @property {{ id: string, title: string, cluster: string, unit: string, price: number }} property
 * @property {Array<{ id: string, at: string, status: keyof typeof CONTACT_STATUS, title: string, propertyLabel: string, note: string }>} history
 */

/** @type {AgentContact[]} */
const CONTACTS = [
  {
    id: "ctc-21",
    buyerId: "byr-21",
    name: "Rani Hartono",
    phone: "+6281357001122",
    email: "rani.hartono@gmail.com",
    city: "Banyumanik, Semarang",
    source: "Portal Web GIS SANG Group",
    score: "Tinggi (94%)",
    scoreTone: "gold",
    status: "BARU",
    lastInteractionAt: "2026-11-04T02:30:00.000Z",
    property: {
      id: "prp-101",
      title: "Rumah Tipe 36 — Blok A",
      cluster: "Candisari Heights",
      unit: "A-04",
      price: 545_000_000,
    },
    history: [
      {
        id: "act-21-1",
        at: "2026-11-04T02:30:00.000Z",
        status: "BARU",
        title: "Pengajuan Kunjungan Lapangan",
        propertyLabel: "Rumah Tipe 36 — Blok A (Candisari Heights · Unit A-04)",
        note: "Ingin survei lokasi hari Sabtu pagi bersama keluarga dan menanyakan simulasi KPR BTN.",
      },
      {
        id: "act-21-2",
        at: "2026-10-31T12:15:00.000Z",
        status: "SELESAI",
        title: "Unduh Brosur & Form Minat Beli",
        propertyLabel: "Rumah Tipe 36 — Blok A (Candisari Heights)",
        note: "Mengunduh e-brosur klaster Candisari Heights melalui halaman properti.",
      },
    ],
  },
  {
    id: "ctc-22",
    buyerId: "byr-22",
    name: "Arif Setyawan",
    phone: "+6281212003344",
    email: "arif.setyawan@gmail.com",
    city: "Kendal, Jawa Tengah",
    source: "Iklan Facebook GIS Leads",
    score: "Sedang (78%)",
    scoreTone: "info",
    status: "KONSULTASI",
    lastInteractionAt: "2026-11-03T07:15:00.000Z",
    property: {
      id: "prp-102",
      title: "Rumah Tipe 45 — Kavling B",
      cluster: "Tembalang Hillcrest",
      unit: "B-07",
      price: 735_000_000,
    },
    history: [
      {
        id: "act-22-1",
        at: "2026-11-03T07:15:00.000Z",
        status: "KONSULTASI",
        title: "Pengajuan Minat Beli",
        propertyLabel: "Rumah Tipe 45 — Kavling B (Tembalang Hillcrest · Unit B-07)",
        note: "Tertarik, apakah masih bisa negosiasi bila pembayaran tunai keras?",
      },
      {
        id: "act-22-2",
        at: "2026-10-30T03:40:00.000Z",
        status: "SELESAI",
        title: "Simulasi KPR Diminta",
        propertyLabel: "Rumah Tipe 45 — Kavling B (Tembalang Hillcrest)",
        note: "Meminta simulasi cicilan KPR BTN tenor 15 tahun untuk unit B-07.",
      },
    ],
  },
  {
    id: "ctc-23",
    buyerId: "byr-23",
    name: "Dian Larasati",
    phone: "+6281298005566",
    email: "dian.larasati@gmail.com",
    city: "Tembalang, Semarang",
    source: "Direct Referral Konsultan",
    score: "Tinggi (89%)",
    scoreTone: "gold",
    status: "DIJADWALKAN",
    lastInteractionAt: "2026-10-30T09:40:00.000Z",
    property: {
      id: "prp-103",
      title: "Rumah Tipe 60 — Kavling C",
      cluster: "Sambiroto Verde",
      unit: "C-02",
      price: 1_180_000_000,
    },
    history: [
      {
        id: "act-23-1",
        at: "2026-10-30T09:40:00.000Z",
        status: "DIJADWALKAN",
        title: "Jadwal Kunjungan Dikonfirmasi",
        propertyLabel: "Rumah Tipe 60 — Kavling C (Sambiroto Verde · Unit C-02)",
        note: "Kunjungan Jumat pukul 09.00 WIB bersama keluarga.",
      },
      {
        id: "act-23-2",
        at: "2026-10-24T09:40:00.000Z",
        status: "SELESAI",
        title: "Pengajuan Kunjungan Lapangan",
        propertyLabel: "Rumah Tipe 60 — Kavling C (Sambiroto Verde)",
        note: "Membawa keluarga untuk melihat langsung denah ruang keluarga.",
      },
    ],
  },
  {
    id: "ctc-24",
    buyerId: "byr-24",
    name: "Bagas Nugroho",
    phone: "+6281376007788",
    email: "bagas.nugroho@gmail.com",
    city: "Ungaran, Kab. Semarang",
    source: "Pameran Mall Ciputra",
    score: "Sedang (70%)",
    scoreTone: "info",
    status: "NEGOSIASI",
    lastInteractionAt: "2026-10-27T04:20:00.000Z",
    property: {
      id: "prp-103",
      title: "Rumah Tipe 60 — Kavling C",
      cluster: "Sambiroto Verde",
      unit: "C-02",
      price: 1_180_000_000,
    },
    history: [
      {
        id: "act-24-1",
        at: "2026-10-27T04:20:00.000Z",
        status: "NEGOSIASI",
        title: "Penawaran Harga Diterima",
        propertyLabel: "Rumah Tipe 60 — Kavling C (Sambiroto Verde · Unit C-02)",
        note: "Menawarkan Rp 1.150.000.000 untuk unit C-02 dan menunggu pencairan dana.",
      },
      {
        id: "act-24-2",
        at: "2026-10-22T04:05:00.000Z",
        status: "SELESAI",
        title: "Pengajuan Minat Beli",
        propertyLabel: "Rumah Tipe 60 — Kavling C (Sambiroto Verde)",
        note: "Menunggu pencairan dana, mohon ditawarkan jadwal berbincang minggu depan.",
      },
    ],
  },
  {
    id: "ctc-27",
    buyerId: "byr-27",
    name: "Dewi Anggraini",
    phone: "+6281288001177",
    email: "dewi.anggraini@gmail.com",
    city: "Sambiroto, Semarang",
    source: "Portal Web GIS SANG Group",
    score: "Tinggi (88%)",
    scoreTone: "gold",
    status: "BARU",
    lastInteractionAt: "2026-10-26T07:00:00.000Z",
    property: {
      id: "prp-103",
      title: "Rumah Tipe 60 — Kavling C",
      cluster: "Sambiroto Verde",
      unit: "C-02",
      price: 1_180_000_000,
    },
    history: [
      {
        id: "act-27-1",
        at: "2026-10-26T07:00:00.000Z",
        status: "BARU",
        title: "Pengajuan Kunjungan Lapangan",
        propertyLabel: "Rumah Tipe 60 — Kavling C (Sambiroto Verde · Unit C-02)",
        note: "Minta simulasi KPR dan memastikan unit masih tersedia sebelum survei.",
      },
      {
        id: "act-27-2",
        at: "2026-10-24T02:20:00.000Z",
        status: "SELESAI",
        title: "Unduh Masterplan",
        propertyLabel: "Rumah Tipe 60 — Kavling C (Sambiroto Verde)",
        note: "Mengunduh masterplan cluster Sambiroto Verde dan denah tipe 60.",
      },
    ],
  },
  {
    id: "ctc-28",
    buyerId: "byr-28",
    name: "Bagas Setiawan",
    phone: "+6281399002211",
    email: "bagas.setiawan@gmail.com",
    city: "Salatiga",
    source: "Kantor Pemasaran SANG",
    score: "Deal Closed (100%)",
    scoreTone: "success",
    status: "DEAL",
    lastInteractionAt: "2026-10-22T03:15:00.000Z",
    property: {
      id: "prp-102",
      title: "Rumah Tipe 45 — Kavling B",
      cluster: "Tembalang Hillcrest",
      unit: "B-07",
      price: 735_000_000,
    },
    history: [
      {
        id: "act-28-1",
        at: "2026-10-22T03:15:00.000Z",
        status: "DEAL",
        title: "Booking Fee Diterima",
        propertyLabel: "Rumah Tipe 45 — Kavling B (Tembalang Hillcrest · Unit B-07)",
        note: "Kuitansi booking fee ditransfer via BCA; unit B-07 dipesan.",
      },
      {
        id: "act-28-2",
        at: "2026-10-20T06:10:00.000Z",
        status: "SELESAI",
        title: "Pengajuan Minat Beli",
        propertyLabel: "Rumah Tipe 45 — Kavling B (Tembalang Hillcrest)",
        note: "Sepakat dengan harga penawaran bila unit dipesan sebelum akhir bulan.",
      },
    ],
  },
  {
    id: "ctc-29",
    buyerId: "byr-29",
    name: "Sinta Maharani",
    phone: "+6281255008899",
    email: "sinta.maharani@gmail.com",
    city: "Semarang Barat",
    source: "WhatsApp Official Bot",
    score: "Deal Closed (100%)",
    scoreTone: "success",
    status: "DEAL",
    lastInteractionAt: "2026-10-20T08:30:00.000Z",
    property: {
      id: "prp-104",
      title: "Rumah Tipe 45 — Blok D",
      cluster: "Sambiroto Verde",
      unit: "D-09",
      price: 690_000_000,
    },
    history: [
      {
        id: "act-29-1",
        at: "2026-10-20T08:30:00.000Z",
        status: "DEAL",
        title: "Unit Terjual",
        propertyLabel: "Rumah Tipe 45 — Blok D (Sambiroto Verde · Unit D-09)",
        note: "Pembayaran lunas, unit D-09 tercatat terjual.",
      },
      {
        id: "act-29-2",
        at: "2026-08-28T03:45:00.000Z",
        status: "SELESAI",
        title: "Pengajuan Minat Beli",
        propertyLabel: "Rumah Tipe 45 — Blok D (Sambiroto Verde)",
        note: "Melanjutkan pembelian unit hook yang sebelumnya sempat dilihat keluarga.",
      },
    ],
  },
  {
    id: "ctc-26",
    buyerId: "byr-26",
    name: "Kurnia Saputra",
    phone: "+6281522004433",
    email: "kurnia.saputra@gmail.com",
    city: "Demak",
    source: "Portal Web GIS SANG Group",
    score: "Dibatalkan (0%)",
    scoreTone: "neutral",
    status: "BATAL",
    lastInteractionAt: "2026-10-15T03:00:00.000Z",
    property: {
      id: "prp-101",
      title: "Rumah Tipe 36 — Blok A",
      cluster: "Candisari Heights",
      unit: "A-04",
      price: 545_000_000,
    },
    history: [
      {
        id: "act-26-1",
        at: "2026-10-15T03:00:00.000Z",
        status: "BATAL",
        title: "Pengajuan Dibatalkan",
        propertyLabel: "Rumah Tipe 36 — Blok A (Candisari Heights · Unit A-04)",
        note: "Tawaran terlalu jauh dari harga resmi dan skema KPR tanpa DP tidak tersedia.",
      },
      {
        id: "act-26-2",
        at: "2026-09-29T06:55:00.000Z",
        status: "SELESAI",
        title: "Pengajuan Minat Beli",
        propertyLabel: "Rumah Tipe 36 — Blok A (Candisari Heights)",
        note: "Menanyakan kemungkinan angsuran tanpa DP.",
      },
    ],
  },
];

/**
 * Daftar kontak, terbaru lebih dulu.
 * @returns {AgentContact[]}
 */
export function getAgentContacts() {
  return [...CONTACTS].sort(
    (a, b) => new Date(b.lastInteractionAt) - new Date(a.lastInteractionAt),
  );
}

/** @param {string|null|undefined} id */
export function getAgentContactById(id) {
  if (!id) return null;
  return CONTACTS.find((contact) => contact.id === id) ?? null;
}
