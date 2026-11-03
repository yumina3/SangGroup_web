/**
 * Data dummy halaman Berita (role pengguna).
 *
 * Teks diambil dari docs/site/berita_sang_group_semarang/code.html.
 */

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BERITA_UTAMA = {
  title: "Berita Terbaru",
  headline:
    "Penyelesaian Struktur Utama Clubhouse Sang Dipa dan Progres Serah Terima Kavling",
  excerpt:
    "Pengembangan infrastruktur kawasan Candisari Hills mencapai fase finishing dengan pembukaan akses jalan ROW 14 meter dan fasilitas infinity pool.",
  image: IMG("1503387762-592deb58ef4e", 1400),
  alt: "Progres konstruksi clubhouse Sang Dipa",
  meta: "10 Februari 2026 · Progress Proyek",
};

export const BERITA_FILTERS = [
  "Semua",
  "Sang Dipa",
  "Sang Wira",
  "Sang Naya",
  "Promo",
];

export const BERITA_ITEMS = [
  {
    id: "dipa-85",
    title: "Progres Konstruksi Klaster Sang Dipa Memasuki Tahap 85%",
    excerpt:
      "Pekerjaan struktural atap dan instalasi smart metering terpadu kini berlanjut ke pematangan lansekap taman hijau privat.",
    category: "Sang Dipa",
    meta: "04 Februari 2026 · 3 min baca",
    image: IMG("1541888946425-d81bb19240f5", 900),
    alt: "Konstruksi klaster Sang Dipa",
  },
  {
    id: "saura-termal",
    title: "Konsep Sirkulasi Silang dan Efisiensi Termal Tipe Saura",
    excerpt:
      "Optimasi ventilasi alami menurunkan konsumsi pendingin ruangan secara terukur berbasis simulasi iklim mikro perbukitan.",
    category: "Sang Dipa",
    meta: "28 Januari 2026 · 6 min baca",
    image: IMG("1600596542815-ffad4c1539a9", 900),
    alt: "Interior tipe Saura dengan sirkulasi silang",
  },
  {
    id: "wellness",
    title: "Fasilitas Wellness Pavilion dan Trek Joging Mulai Dibuka",
    excerpt:
      "Kawasan kebugaran eksklusif seluas 1,2 hektar kini siap melayani para pemilik hunian awal dengan lanskap rimbun.",
    category: "Sang Wira",
    meta: "21 Januari 2026 · 4 min baca",
    image: IMG("1571008887538-b36bb32f4571", 900),
    alt: "Trek joging dengan pepohonan",
  },
  {
    id: "gate-ai",
    title: "Integrasi Sistem Keamanan Otomatisasi AI di Main Gate Sang Naya",
    excerpt:
      "Pengenalan plat nomor kendaraan otomatis dan RFID multi-titik memberikan proteksi maksimal selama 24 jam penuh.",
    category: "Sang Naya",
    meta: "15 Januari 2026 · 3 min baca",
    image: IMG("1558002038-1055907df827", 900),
    alt: "Gerbang utama dengan sistem keamanan",
  },
  {
    id: "kpr",
    title: "Program Suku Bunga KPR Khusus Bermitra dengan 5 Bank Nasional",
    excerpt:
      "Dapatkan skema pembiayaan bertahap dengan fixed interest rate kompetitif untuk kepemilikan unit premier di kuartal empat.",
    category: "Promo",
    meta: "08 Januari 2026 · 5 min baca",
    image: IMG("1554224155-6726b3ff858f", 900),
    alt: "Dokumen pembiayaan KPR",
  },
  {
    id: "bioswale",
    title: "Penguatan Sistem Resapan Air Mandiri Ramah Lingkungan",
    excerpt:
      "Pembangunan bioswale bioretensi aktif menjamin kawasan bebas genangan sekaligus menjaga kelembapan tanah perbukitan.",
    category: "Sang Dipa",
    meta: "02 Januari 2026 · 4 min baca",
    image: IMG("1470071459604-3b5ec3a7fe05", 900),
    alt: "Sistem resapan air hijau",
  },
];

export const PENAWARAN = {
  title: "Dapatkan Penawaran Eksklusif",
  body: "Tinggalkan kontak Anda, tim kami akan menghubungi lewat WhatsApp.",
  privacy: "*Data Anda kami jaga kerahasiaannya.",
  fields: [
    { id: "nama", label: "Nama Lengkap", placeholder: "Contoh: Budi Santoso", type: "text" },
    { id: "email", label: "Email", placeholder: "Contoh: budi@email.com", type: "email" },
    { id: "wa", label: "Nomor WhatsApp", placeholder: "Contoh: 0812 3456 7890", type: "tel" },
    { id: "kota", label: "Kota", placeholder: "Contoh: Semarang", type: "text" },
  ],
  submit: "Dapatkan Penawaran",
};
