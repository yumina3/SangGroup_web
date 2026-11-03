/**
 * Data dummy halaman Tentang Kami (role pengguna).
 *
 * Seluruh teks diambil dari docs/site/tentang_kami_sang_group_semarang/code.html
 * agar halaman hanya mengurus tata letak.
 */

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const ABOUT_HERO = {
  title:
    "Membangun Peradaban Residensial Berkelanjutan di Lanskap Perbukitan Semarang",
  body: "Mengintegrasikan keasrian topografi alami dengan presisi geospasial mutakhir. Menghadirkan hunian tapak berorientasi mikroklimat, legalitas absolut SHM BPN, dan keagungan arsitektur tropis abadi melintasi generasi.",
  image: IMG("1600585154340-be6161a56a0c", 1920),
  alt: "Kawasan residensial perbukitan dengan arsitektur tropis",
  pillars: [
    {
      id: "masterplan",
      stat: "3",
      statLabel: "Kawasan",
      title: "Portofolio Masterplan",
      body: "Masterplanned Communities unggulan: Sang Dipa Residence, Sang Wira Residence, & Sang Naya Residence.",
    },
    {
      id: "legal",
      stat: "100%",
      statLabel: "SHM",
      title: "Jaminan Hukum & Agraria",
      body: "Sertifikasi Hak Milik murni telah pecah per unit melalui kantor BPN Kota Semarang lengkap dengan PBG definitif.",
    },
    {
      id: "eco",
      stat: "40%",
      statLabel: "RTH",
      title: "Ekologi & Tata Lingkungan",
      body: "Ruang Terbuka Hijau terintegrasi dan konservasi kontur lereng alami untuk resapan air serta iklim mikro sejuk.",
    },
  ],
};

export const VISION_MISSION = {
  eyebrow: "Arah Langkah & Komitmen",
  vision: {
    title: "Visi",
    subtitle: "Visi Fundamental",
    body: "Menjadi pelopor pengembangan kawasan residensial perbukitan terpadu di Jawa Tengah yang memadukan keindahan kontur lanskap alami dengan presisi rekayasa geospasial mutakhir dan tata kelola ramah lingkungan.",
    extra:
      "Setiap tapak dirancang menghadirkan kenyamanan mikroklimat optimal, jaminan legalitas SHM absolut, serta nilai kemewahan hidup tanpa kompromi melintasi lintas generasi.",
  },
  mission: {
    title: "Misi",
    subtitle: "Misi Strategis",
    intro:
      "Komitmen teguh dalam mewujudkan kawasan hunian terencana melalui integrasi ekologi, sains geospasial, dan tata kelola profesional:",
    items: [
      {
        title: "Presisi GIS & Kontur",
        body: "Pemetaan satelit berakurasi tinggi guna menjamin stabilitas lereng dan tata kelola air.",
      },
      {
        title: "Legalitas & Kepastian SHM",
        body: "Sertifikasi murni terpecah BPN Kota Semarang sebelum penawaran kavling.",
      },
      {
        title: "Arsitektur Tropis Adaptif",
        body: "Optimalisasi ventilasi pasif dan orientasi iklim mikro alami Semarang.",
      },
      {
        title: "Estate Berkelanjutan",
        body: "Tata kelola lingkungan mandiri dengan 40% proporsi Ruang Terbuka Hijau.",
      },
    ],
  },
  ctaPrimary: "Pelajari Selengkapnya",
  ctaSecondary: "Konsultasi Masterplan",
};

export const JOURNEY = {
  eyebrow: "Jejak Langkah Perjalanan",
  heading: "Dedikasi Panjang Merajut Harmoni Alam & Kemewahan",
  intro:
    "Perjalanan SANG Group berakar dari visi sederhana namun revolusioner di lanskap perbukitan Semarang: menghadirkan hunian yang tidak menaklukkan alam melalui ekskavasi masif, melainkan berpadu selaras dengan kontur lereng alami.",
  intro2:
    "Berawal dari akuisisi tapak lereng prestisius di Candisari Hills pada tahun 2021, kami mempelopori integrasi sistem GIS spasial dan kajian geoteknik bor-pile pertama untuk perumahan privat di Semarang. Kini, dedikasi tersebut telah berkembang menjadi ekosistem hunian mahakarya yang menaungi ratusan keluarga terpandang di berbagai kawasan strategis.",
  milestones: [
    {
      year: "2021",
      tag: "2021 • Lahan Perbukitan",
      title: "Fondasi & Pionir GIS Topografi",
      body: "Peletakan batu pertama Sang Dipa Residence Candisari Hills dengan sertifikasi SHM murni dan pemetaan satelit presisi.",
      image: IMG("1512917774080-9991f1c4c750", 900),
      alt: "Peletakan batu pertama kawasan perbukitan",
    },
    {
      year: "2024",
      tag: "2024 • Ekspansi",
      title: "Ekspansi Tembalang & Sambiroto",
      body: "Peluncuran Sang Wira Residence serta masterplan Biophilic Healing Park di Sang Naya Residence.",
      image: IMG("1580587771525-78b9dba3b914", 900),
      alt: "Ekspansi kawasan hunian baru",
    },
    {
      year: "2026",
      tag: "Present • Mahakarya",
      title: "Ekosistem Residensial Terpadu Masa Depan",
      body: "Pengembangan lifestyle community center ramah lingkungan dan konsolidasi kawasan hijau terpadu Jawa Tengah.",
      image: IMG("1564013799919-ab600027ffc6", 900),
      alt: "Ekosistem residensial terpadu",
    },
  ],
};

export const TEAM = {
  eyebrow: "Profesionalisme Berlisensi",
  heading: "TIM PAKAR & AGEN KAMI",
  body: "Konsultan berlisensi dan arsitek berdedikasi mendampingi setiap langkah kepemilikan aset berharga Anda di perbukitan Semarang.",
  members: [
    {
      name: "Ir. Hendra Sangjaya, M.Ars",
      role: "Principal Architect",
      category: "Arsitektur",
      image: IMG("1560250097-0b93528c311a", 600),
      alt: "Principal Architect",
    },
    {
      name: "Dr. Arya Daniswara, M.Sc.",
      role: "Geospatial Specialist",
      category: "GIS Spasial",
      image: IMG("1573496359142-b8d87734a5a2", 600),
      alt: "Geospatial Specialist",
    },
    {
      name: "Citra Laksmi Pratista, S.H.",
      role: "Direktur Tata Kelola & Legalitas",
      category: "Legalitas BPN",
      image: IMG("1580489944761-15a19d654956", 600),
      alt: "Direktur Tata Kelola & Legalitas",
    },
    {
      name: "Budi Santoso, S.T.",
      role: "Senior Landscape Engineer",
      category: "Struktur",
      image: IMG("1519085360753-af0119f7cbe7", 600),
      alt: "Senior Landscape Engineer",
    },
    {
      name: "Amanda Putri, B.B.A.",
      role: "Head of VIP Advisory",
      category: "Advisory",
      image: IMG("1573497019940-1c28c88b4f3e", 600),
      alt: "Head of VIP Advisory",
    },
  ],
  cta: "Konsultasi Bersama Tim Pakar VIP",
};
