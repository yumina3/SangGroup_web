/**
 * Kontrak data dashboard agen.
 *
 * Semua halaman dashboard penjual menerima data lewat props dengan bentuk di
 * bawah ini. Saat ini nilainya berasal dari `AGENT_DEMO` — data contoh yang
 * ditulis khusus untuk komponen ini, bukan salinan teks/gambar docs/agen
 * (SRS-D-03). Ketika modul data disambungkan, `getAgentDashboard()` tinggal
 * diisi query Prisma dengan bentuk yang sama sehingga komponen tidak berubah.
 *
 * @typedef {"DRAFT"|"PENDING"|"VERIFIED"|"REJECTED"|"HIDDEN"} ListingStatus
 * @typedef {"AVAILABLE"|"BOOKED"|"SOLD"} SaleStatus
 * @typedef {"PENDING"|"CONFIRMED"|"RESCHEDULED"|"REJECTED"|"COMPLETED"|"CANCELLED"} InquiryStatus
 * @typedef {"VISIT"|"INTEREST"} InquiryType
 *
 * @typedef {object} AgentProfile
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone      format +62xxxxxxxxx
 * @property {string} agencyName
 * @property {string} agentCode
 * @property {string|null} avatarUrl        foto profil di Storage; null = belum ada
 *
 * @typedef {object} AgentProperty
 * @property {string} id
 * @property {string} title
 * @property {string} cluster
 * @property {string} unit
 * @property {string} category
 * @property {number} price                          rupiah, > 0
 * @property {string} city
 * @property {string} address
 * @property {number} landArea                       m2
 * @property {number} buildingArea                   m2
 * @property {number} bedrooms
 * @property {number} bathrooms
 * @property {number} floors
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} description
 * @property {ListingStatus} listingStatus
 * @property {SaleStatus} saleStatus
 * @property {string|null} rejectionReason           dari VerificationLog terakhir
 * @property {number} activeInquiries
 * @property {string|null} primaryPhotoUrl           null bila belum ada foto
 * @property {string} createdAt                      ISO string
 * @property {string} updatedAt                      ISO string
 *
 * @typedef {object} AgentInquiry
 * @property {string} id
 * @property {InquiryType} type
 * @property {InquiryStatus} status
 * @property {string} createdAt                      ISO string
 * @property {string|null} scheduledAt               ISO string, khusus kunjungan
 * @property {string|null} message
 * @property {number|null} offerPrice
 * @property {string|null} sellerNote
 * @property {{ id: string, name: string, phone: string }} buyer
 * @property {{ id: string, title: string, price: number }} property
 *
 * @typedef {object} AgentSummary
 * @property {number} totalProperties
 * @property {number} pendingVerification
 * @property {number} activeInquiries
 * @property {number} soldProperties
 * @property {number} soldValue                      total harga properti SOLD
 * @property {number} availableCount
 * @property {number} bookedCount
 * @property {number} activeListingValue             total harga listing VERIFIED non-SOLD
 *
 * @typedef {object} AgentDashboard
 * @property {AgentProfile} agent
 * @property {AgentSummary} summary
 * @property {AgentProperty[]} properties
 * @property {AgentInquiry[]} inquiries
 */

/** @returns {AgentDashboard} */
export function getAgentDashboard() {
  return {
    agent: { ...AGENT },
    summary: { ...SUMMARY },
    properties: PROPERTIES,
    inquiries: INQUIRIES,
  };
}

const AGENT = {
  id: "agt-0117",
  name: "Nadia Prameswari",
  email: "nadia.prameswari@sanggroup.id",
  phone: "+6281200110022",
  agencyName: "Sang Mandiri Property Semarang",
  agentCode: "AGT-SMG-0117",
  avatarUrl: null,
};

const SUMMARY = {
  totalProperties: 6,
  pendingVerification: 1,
  activeInquiries: 3,
  soldProperties: 1,
  soldValue: 465_000_000,
  availableCount: 4,
  bookedCount: 1,
  activeListingValue: 3_115_000_000,
};

/** @type {AgentProperty[]} */
const PROPERTIES = [
  {
    id: "prp-101",
    title: "Rumah Tipe 36 — Blok A",
    cluster: "Candisari Heights",
    unit: "A-04",
    category: "Rumah",
    price: 545_000_000,
    city: "Semarang",
    address: "Jl. Tegalsari Raya No. 8, Candisari, Semarang",
    landArea: 72,
    buildingArea: 36,
    bedrooms: 2,
    bathrooms: 1,
    floors: 1,
    latitude: -7.01124,
    longitude: 110.41351,
    description:
      "Unit satu lantai dengan taman samping, menghadap jalan lingkungan yang lebar. Sertifikat SHM pecah dan PBG sudah lengkap.",
    listingStatus: "VERIFIED",
    saleStatus: "AVAILABLE",
    rejectionReason: null,
    activeInquiries: 2,
    primaryPhotoUrl: null,
    createdAt: "2026-10-02T02:10:00.000Z",
    updatedAt: "2026-10-24T03:25:00.000Z",
  },
  {
    id: "prp-102",
    title: "Rumah Tipe 45 — Kavling B",
    cluster: "Tembalang Hillcrest",
    unit: "B-07",
    category: "Rumah",
    price: 735_000_000,
    city: "Semarang",
    address: "Jl. Ngesrep Timur V No. 21, Tembalang, Semarang",
    landArea: 84,
    buildingArea: 45,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    latitude: -7.05311,
    longitude: 110.43772,
    description:
      "Desain tropis modern dengan pencahayaan alami dari dua sisi. Menuju kampus dan rumah sakit dengan akses jalan aspal.",
    listingStatus: "VERIFIED",
    saleStatus: "BOOKED",
    rejectionReason: null,
    activeInquiries: 1,
    primaryPhotoUrl: null,
    createdAt: "2026-09-18T05:40:00.000Z",
    updatedAt: "2026-10-21T08:05:00.000Z",
  },
  {
    id: "prp-103",
    title: "Rumah Tipe 60 — Kavling C",
    cluster: "Sambiroto Verde",
    unit: "C-02",
    category: "Rumah",
    price: 1_180_000_000,
    city: "Semarang",
    address: "Jl. Sambiroto Raya No. 55, Tembalang, Semarang",
    landArea: 96,
    buildingArea: 60,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    latitude: -7.06128,
    longitude: 110.44106,
    description:
      "Dua lantai dengan balkon belakang menghadap area hijau cluster. Dekat akses tol dan pusat kuliner.",
    listingStatus: "VERIFIED",
    saleStatus: "AVAILABLE",
    rejectionReason: null,
    activeInquiries: 0,
    primaryPhotoUrl: null,
    createdAt: "2026-08-30T01:15:00.000Z",
    updatedAt: "2026-10-11T04:45:00.000Z",
  },
  {
    id: "prp-104",
    title: "Rumah Tipe 45 — Blok D",
    cluster: "Sambiroto Verde",
    unit: "D-09",
    category: "Rumah",
    price: 690_000_000,
    city: "Semarang",
    address: "Jl. Sambiroto Raya No. 91, Tembalang, Semarang",
    landArea: 84,
    buildingArea: 45,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    latitude: -7.06202,
    longitude: 110.44291,
    description:
      "Unit posisi hook dengan carport dua mobil. Sudah pernah dipasarkan dan laku; data tetap tersimpan untuk riwayat.",
    listingStatus: "VERIFIED",
    saleStatus: "SOLD",
    rejectionReason: null,
    activeInquiries: 0,
    primaryPhotoUrl: null,
    createdAt: "2026-05-12T07:20:00.000Z",
    updatedAt: "2026-09-02T09:30:00.000Z",
  },
  {
    id: "prp-105",
    title: "Rumah Tipe 72 — Blok E",
    cluster: "Candisari Heights",
    unit: "E-01",
    category: "Rumah",
    price: 1_450_000_000,
    city: "Semarang",
    address: "Jl. Tegalsari Raya No. 30, Candisari, Semarang",
    landArea: 120,
    buildingArea: 72,
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    latitude: -7.01255,
    longitude: 110.41493,
    description:
      "Tipe terluas di cluster dengan taman belakang dan ruang keluarga terpisah. Menunggu verifikasi admin sebelum tampil di katalog.",
    listingStatus: "PENDING",
    saleStatus: "AVAILABLE",
    rejectionReason: null,
    activeInquiries: 0,
    primaryPhotoUrl: null,
    createdAt: "2026-10-27T02:05:00.000Z",
    updatedAt: "2026-10-27T02:05:00.000Z",
  },
  {
    id: "prp-106",
    title: "Rumah Tipe 45 — Kavling B",
    cluster: "Tembalang Hillcrest",
    unit: "B-12",
    category: "Rumah",
    price: 760_000_000,
    city: "Semarang",
    address: "Jl. Ngesrep Timur V No. 44, Tembalang, Semarang",
    landArea: 84,
    buildingArea: 45,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    latitude: -7.05440,
    longitude: 110.43888,
    description:
      "Ditolak admin karena titik koordinat tidak sesuai dokumen sertifikat. Perbarui pin peta lalu kirim ulang.",
    listingStatus: "REJECTED",
    saleStatus: "AVAILABLE",
    rejectionReason: "Titik koordinat tidak sesuai dengan sertifikat tanah.",
    activeInquiries: 0,
    primaryPhotoUrl: null,
    createdAt: "2026-10-08T03:00:00.000Z",
    updatedAt: "2026-10-19T06:10:00.000Z",
  },
];

/** @type {AgentInquiry[]} */
const INQUIRIES = [
  {
    id: "inq-501",
    type: "VISIT",
    status: "PENDING",
    createdAt: "2026-10-28T02:30:00.000Z",
    scheduledAt: "2026-10-31T03:00:00.000Z",
    message: "Ingin melihat kondisi unit dan jalan lingkungan pada pagi hari.",
    offerPrice: null,
    sellerNote: null,
    buyer: { id: "byr-21", name: "Rani Hartono", phone: "+6281357001122" },
    property: { id: "prp-101", title: "Rumah Tipe 36 — Blok A", price: 545_000_000 },
  },
  {
    id: "inq-502",
    type: "INTEREST",
    status: "PENDING",
    createdAt: "2026-10-27T13:15:00.000Z",
    scheduledAt: null,
    message: "Tertarik, apakah masih bisa negosiasi bila pembayaran tunai keras?",
    offerPrice: 700_000_000,
    sellerNote: null,
    buyer: { id: "byr-22", name: "Arif Setyawan", phone: "+6281212003344" },
    property: { id: "prp-102", title: "Rumah Tipe 45 — Kavling B", price: 735_000_000 },
  },
  {
    id: "inq-503",
    type: "VISIT",
    status: "CONFIRMED",
    createdAt: "2026-10-24T09:40:00.000Z",
    scheduledAt: "2026-10-30T02:00:00.000Z",
    message: "Membawa keluarga untuk melihat langsung denah ruang keluarga.",
    offerPrice: null,
    sellerNote: "Dijadwalkan. Surveyor gallery akan menemani.",
    buyer: { id: "byr-23", name: "Dian Larasati", phone: "+6281298005566" },
    property: { id: "prp-103", title: "Rumah Tipe 60 — Kavling C", price: 1_180_000_000 },
  },
  {
    id: "inq-504",
    type: "INTEREST",
    status: "RESCHEDULED",
    createdAt: "2026-10-22T04:05:00.000Z",
    scheduledAt: null,
    message: "Menunggu pencairan dana, mohon ditawarkan jadwal berbincang minggu depan.",
    offerPrice: 1_150_000_000,
    sellerNote: "Dijadwalkan ulang ke pekan depan sesuai permintaan pembeli.",
    buyer: { id: "byr-24", name: "Bagas Nugroho", phone: "+6281376007788" },
    property: { id: "prp-103", title: "Rumah Tipe 60 — Kavling C", price: 1_180_000_000 },
  },
  {
    id: "inq-505",
    type: "VISIT",
    status: "COMPLETED",
    createdAt: "2026-10-05T01:20:00.000Z",
    scheduledAt: "2026-10-07T02:30:00.000Z",
    message: "Kunjungan pertama untuk membandingkan dua tipe di cluster yang sama.",
    offerPrice: null,
    sellerNote: "Kunjungan selesai, pembeli memilih tipe lain.",
    buyer: { id: "byr-25", name: "Hendra Wibisono", phone: "+6281411009900" },
    property: { id: "prp-101", title: "Rumah Tipe 36 — Blok A", price: 545_000_000 },
  },
  {
    id: "inq-506",
    type: "INTEREST",
    status: "REJECTED",
    createdAt: "2026-09-29T06:55:00.000Z",
    scheduledAt: null,
    message: "Menanyakan kemungkinan angsuran tanpa DP.",
    offerPrice: 380_000_000,
    sellerNote: "Tawaran terlalu jauh dari harga resmi dan skema KPR tidak tersedia.",
    buyer: { id: "byr-26", name: "Kurnia Saputra", phone: "+6281522004433" },
    property: { id: "prp-101", title: "Rumah Tipe 36 — Blok A", price: 545_000_000 },
  },
];

export const AGENT_CATEGORY_OPTIONS = ["Rumah", "Ruko", "Kavling", "Apartemen"];
