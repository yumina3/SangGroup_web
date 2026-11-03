/**
 * Data dummy beranda situs publik (role pengguna).
 *
 * Semua teks dan angka yang tampil di beranda berasal dari sini, sehingga
 * komponen hanya mengurus tata letak dan nanti cukup array ini yang diganti
 * pemanggilan Prisma.
 *
 * Gambar memakai Unsplash (keputusan: URL googleusercontent di code.html
 * kedaluwarsa).
 */

const IMG = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BRAND = {
  site: "www.sanggroup.id",
  phone: "0812-3456-7890",
};

export const HERO = {
  title: "Forest Park",
  titleAccent: "at Your Doorstep",
  body: "Keseimbangan arsitektur tropis kontemporer dan kemewahan hutan bukit Candisari di ambang pintu Anda.",
  image: IMG("1600585154340-be6161a56a0c", 1920),
  alt: "Villa tropis modern dua lantai dengan fasad kayu dan kaca saat senja",
};

export const ABOUT = {
  heading: "Explore Sang Group Semarang",
  body: "Pilihan utama Anda untuk kawasan hunian terpadu dan presisi arsitektur tropis terbaik di Jawa Tengah. SANG Group menghadirkan kawasan hunian berskala terpadu dengan integrasi tata kota digital, elevasi sejuk bebas banjir, dan legalitas SHM terjamin.",
  pillars: ["A Place to Live", "A Place to Work", "A Place to Play"],
};

export const FEATURES = {
  heading: "Nature International Living",
  body: "Pusat bisnis, edukasi, rekreasi, dan gaya hidup sehat terintegrasi di perbukitan Semarang.",
  items: [
    { icon: "pin", label: "Lokasi Strategis Bebas Banjir" },
    { icon: "bolt", label: "Underground Electrical & Fiber Optic" },
    { icon: "send", label: "Akses Langsung Gerbang Tol" },
    { icon: "leaf", label: "Kawasan Hijau & Danau Alami 40%" },
    { icon: "drop", label: "Sistem Pengolahan Air Mandiri" },
    { icon: "pool", label: "Clubhouse & Infinity Pool" },
    { icon: "shield", label: "One-Gate System RFID 24/7" },
    { icon: "map", label: "Masterplan Presisi Geospasial BPN" },
  ],
  highlight: {
    eyebrow: "Eco Hillside Living",
    title: "Harmony with Nature",
    caption: "Kawasan hijau asri dengan danau alami 40% & panorama perbukitan sejuk.",
    image: IMG("1441974231531-c6227db76b6e", 900),
    alt: "Pohon besar rindang di samping rumah tropis",
  },
  lifestyle: [
    { id: "yoga", label: "Outdoor Yoga Pavilion", image: IMG("1544161515-4ab6ce6db874", 800) },
    { id: "pool", label: "Clubhouse Poolside Lounger", image: IMG("1571896349842-33c89424de2d", 800) },
    { id: "taman", label: "Taman Kontur & Shaded Trees", image: IMG("1470071459604-3b5ec3a7fe05", 800) },
    { id: "lounge", label: "Private Community Lounge", image: IMG("1600607687939-ce8a6c25118c", 800) },
  ],
  caption:
    "Komitmen SANG Group untuk mempercepat kemajuan perumahan berkelanjutan di koridor metropolitan Semarang bersama mitra strategis.",
};

export const METRICS = [
  { value: "3", label: "Kawasan" },
  { value: "100%", label: "SHM" },
  { value: "40%", label: "RTH" },
];

export const TOUR = {
  eyebrow: "Pengalaman Imersif Tanpa Batas",
  heading: "Jelajah Tur Virtual 360° Kawasan & Unit",
  body: "Rasakan kemewahan arsitektur hunian SANG Group secara virtual dari kenyamanan rumah Anda sebelum berkunjung langsung ke Marketing Gallery.",
  hotspot: "Kamar Tidur Utama",
  tabs: [
    {
      id: "living",
      label: "Living Room (Tipe Saura)",
      badge: "Living Room – Rumah Contoh Tipe Saura",
      image: IMG("1600607687920-4e2a09cf159d", 1600),
      alt: "Panorama ruang tamu rumah contoh tipe Saura",
    },
    {
      id: "clubhouse",
      label: "Clubhouse & Pool",
      badge: "Clubhouse & Infinity Pool",
      image: IMG("1571896349842-33c89424de2d", 1600),
      alt: "Panorama kolam infinity clubhouse",
    },
    {
      id: "gate",
      label: "Main Gate (RFID)",
      badge: "Main Gate – One-Gate System RFID",
      image: IMG("1600585154526-990dced4db0d", 1600),
      alt: "Panorama gerbang utama kawasan",
    },
  ],
};

export const PORTFOLIO = {
  eyebrow: "Koleksi Hunian Ikonik",
  heading: "Portofolio Kawasan Hunian Terpadu",
  body: "Eksplorasi pilihan residensial prestisius yang dirancang dengan tata ruang fungsional, pencahayaan alami optimal, dan nilai apresiasi investasi properti tertinggi di Semarang.",
  tabs: [
    { id: "dipa", label: "Sang Dipa (Candisari)", slug: "sang-dipa" },
    { id: "wira", label: "Sang Wira (Tembalang)", slug: "sang-wira" },
    { id: "naya", label: "Sang Naya (Sambiroto)", slug: "sang-naya" },
  ],
  items: {
    dipa: [
      {
        id: "saura",
        badge: "Sisa 3 Unit",
        price: "Mulai Rp 2.45 Milyar",
        cluster: "Sang Dipa Hills",
        size: "Tipe 145 / 160",
        title: "Tipe Saura (Villa 2 Lantai)",
        description:
          "Desain arsitektur bertingkat elegan dengan double-height ceiling ruang keluarga, teras santai, dan panorama lembah hijau.",
        specs: [
          { label: "K.Tidur", value: "4" },
          { label: "K.Mandi", value: "3" },
          { label: "L.Tanah", value: "160m²" },
          { label: "L.Bangunan", value: "145m²" },
        ],
        image: IMG("1600596542815-ffad4c1539a9", 900),
        alt: "Fasad villa dua lantai tipe Saura",
      },
      {
        id: "kalandra",
        badge: "Sisa 5 Unit",
        price: "Mulai Rp 1.95 Milyar",
        cluster: "Sang Dipa Hills",
        size: "Tipe 120 / 140",
        title: "Tipe Kalandra (Modern Tropis)",
        description:
          "Tata ruang open-concept dengan cross-ventilation dan inner courtyard yang menghadirkan kesejukan alami.",
        specs: [
          { label: "K.Tidur", value: "3" },
          { label: "K.Mandi", value: "3" },
          { label: "L.Tanah", value: "140m²" },
          { label: "L.Bangunan", value: "120m²" },
        ],
        image: IMG("1568605114967-8130f3a36994", 900),
        alt: "Rumah modern tropis tipe Kalandra",
      },
      {
        id: "naraya",
        badge: "Terakhir 1 Unit",
        price: "Mulai Rp 3.20 Milyar",
        cluster: "Sang Dipa Hills",
        size: "Tipe 210 / 220",
        title: "Tipe Naraya (Signature Villa)",
        description:
          "Kavling hook premium dengan panorama kota Semarang 180°, opsi private dipping pool, dan spesifikasi material ultra premium.",
        specs: [
          { label: "K.Tidur", value: "5" },
          { label: "K.Mandi", value: "4" },
          { label: "L.Tanah", value: "220m²" },
          { label: "L.Bangunan", value: "210m²" },
        ],
        image: IMG("1613490493576-7fde63acd811", 900),
        alt: "Signature villa tipe Naraya dengan panorama kota",
      },
    ],
  },
  cta: "Detail Tipe & Denah",
  detailHref: "/sang-dipa",
};

export const GIS = {
  eyebrow: "Peta GIS Kawasan Terpadu",
  heading: "Lokasi Proyek Sang Group",
  body: "Aksesibilitas strategis koridor perbukitan Semarang bersertifikat BPN.",
  tabs: [
    { id: "all", label: "Semua Kawasan" },
    { id: "dipa", label: "Sang Dipa (Candisari)" },
    { id: "wira", label: "Sang Wira (Tembalang)" },
    { id: "naya", label: "Sang Naya (Sambiroto)" },
  ],
  mapTopLeft: "Simpang Lima Pusat ← 6.2 km",
  mapTopRight: "Tol Semarang – Solo",
  mapModes: ["Kontur GIS", "Satelit 3D", "Zonasi SHM"],
  coordinates: "E: 110°24'52\" | S: 7°01'38\"",
  markers: [
    { id: "dipa", number: 1, label: "Sang Dipa Residence", sub: "Candisari Hills • Elevasi +310m", x: 28, y: 30 },
    { id: "wira", number: 2, label: "Sang Wira Residence", sub: "Tembalang Corridor • UNDIP 5 Menit", x: 64, y: 52 },
    { id: "naya", number: 3, label: "Sang Naya Residence", sub: "Sambiroto Park", x: 45, y: 74 },
  ],
  panels: {
    all: {
      eyebrow: "Kawasan 1",
      chip: "Candisari Hills",
      title: "Sang Dipa Residence",
      description:
        "Cluster eksklusif lereng Candisari dengan panorama kota Semarang 180° dan akses langsung 6 menit ke pusat kota Simpang Lima.",
      facts: [
        { label: "Akses Gerbang Tol", value: "Tol Jatingaleh (4 Menit)" },
        { label: "Karakteristik Lahan", value: "Kontur Bukit Bebas Banjir" },
        { label: "Legalitas Tanah", value: "Sertifikat SHM Murni Split" },
        { label: "Kisaran Harga", value: "Mulai Rp 1.95 – 3.20 Milyar", highlight: true },
      ],
    },
  },
  ctaPrimary: "Jadwalkan Survei Kawasan Ini",
  ctaSecondary: "Konsultasi GIS via WhatsApp",
  detailHref: "/lokasi",
};

export const NEWS = {
  eyebrow: "Kabar & Edukasi Properti",
  heading: "Rilis Terbaru & Insight Pasar",
  body: "Dapatkan perkembangan konstruksi kawasan terkini dan panduan berharga dalam memilih aset properti di wilayah metropolitan Semarang.",
  items: [
    {
      id: "news-1",
      chip: "Infrastruktur",
      meta: "18 Februari 2026 | 4 min baca",
      title: "Percepatan Akses Jalan Menuju Sang Wira Tembalang",
      excerpt: "Peletakan sirkuit baru di koridor Tembalang memangkas waktu tempuh menuju kawasan sebanyak 12 menit.",
      image: IMG("1449824913935-59a10b8d2000", 800),
      alt: "Jalan akses kawasan dengan pepohonan",
    },
    {
      id: "news-2",
      chip: "Panduan GIS",
      meta: "12 Februari 2026 | 6 min baca",
      title: "Tips Memilih Arah Hadap Rumah Berdasarkan GIS",
      excerpt: "Analisis geospasial membantu menentukan orientasi rumah agar mendapatkan cahaya dan sirkulasi optimal.",
      image: IMG("1524661135-423995f22d0b", 800),
      alt: "Peta digital dan analisis tata ruang kawasan",
    },
    {
      id: "news-3",
      chip: "Progress Proyek",
      meta: "04 Februari 2026 | 3 min baca",
      title: "Konstruksi Cluster Sang Dipa Capai 85%",
      excerpt: "Pekerjaan struktur utama cluster Sang Dipa memasuki tahap penyelesaian fasad dan lansekap kawasan.",
      image: IMG("1503387762-592deb58ef4e", 800),
      alt: "Konstruksi bangunan perumahan yang sedang berjalan",
    },
  ],
  cta: "Baca Selengkapnya",
  detailHref: "/berita",
};

export const VISIT = {
  eyebrow: "Konsultasi Eksklusif",
  heading: "Jadwalkan Kunjungan Ke Marketing Gallery",
  body: "Diskusikan kebutuhan hunian Anda bersama konsultan kami dan dapatkan presentasi masterplan kawasan secara langsung.",
  contacts: [
    {
      id: "office",
      icon: "pin",
      label: "Kantor Pusat & Gallery",
      lines: ["Jl. Diponegoro No. 88, Lahai Sirandu, Gajahmungkur,", "Kota Semarang, Jawa Tengah 50232"],
    },
    {
      id: "hours",
      icon: "clock",
      label: "Jam Operasional Layanan",
      lines: ["Senin – Minggu, 08.30 – 17.00 WIB", "(Buka Setiap Hari)"],
    },
    {
      id: "phone",
      icon: "phone",
      label: "Layanan Telepon Langsung",
      lines: ["+62 (024) 841-2026 / +62 812-3456-7890"],
    },
  ],
  form: {
    heading: "Formulir Kunjungan VIP",
    body: "Pilih waktu yang paling sesuai dengan jadwal Anda. Tim kami akan menyiapkan sambutan khusus dan demonstrasi masterplan digital.",
    nameLabel: "Nama Lengkap",
    namePlaceholder: "Contoh: Budi Santoso",
    phoneLabel: "Nomor WhatsApp Aktif",
    phonePlaceholder: "Contoh: 0812 3456 789",
    clusterLabel: "Kawasan yang Diminati",
    clusters: [
      "Sang Dipa Residence (Candisari Hills)",
      "Sang Wira Residence (Tembalang)",
      "Sang Naya Residence (Sambiroto Park)",
    ],
    dateLabel: "Rencana Tanggal Kunjungan",
    timeLabel: "Pilihan Jam Kunjungan",
    times: [
      { id: "09", label: "09:00 – 11:00" },
      { id: "11", label: "11:00 – 13:00" },
      { id: "14", label: "14:00 – 16:00" },
      { id: "16", label: "16:00 – 17:30" },
    ],
    noteLabel: "Catatan Tambahan (Opsional)",
    notePlaceholder: "Sebutkan jika ada kebutuhan khusus atau pertanyaan fasilitas komunitas...",
    submit: "Konfirmasi Jadwal Kunjungan VIP",
    privacy: "Privasi Anda terjamin 100%. Data dilindungi sistem enkripsi keamanan SANG Group.",
    consultant: "Konsultan Resmi Bersertifikat",
  },
};
