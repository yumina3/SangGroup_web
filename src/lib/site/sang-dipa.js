/**
 * Data dummy halaman Sang Dipa (Products).
 *
 * Teks diambil dari docs/site/sang_dipa_proyek_residensial_property_kita/code.html.
 */

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DIPA_HERO = {
  eyebrow: "Kawasan Residensial Eksklusif",
  title: "Selamat Datang di Sang Dipa",
  body: "Nikmati ketenangan hidup di perbukitan hijau Candisari dengan ketinggian 160 mdpl. Udara sejuk pegunungan berpadu dengan arsitektur tropis kontemporer, dirancang khusus untuk kenyamanan harmonis hunian lintas generasi Anda.",
  badges: [
    "Kawasan Candisari • Elevasi 160 MDPL • Suhu Rata-rata 24°C",
    "Sertipikat Hak Milik (SHM)",
    "Akses Tol 8 Menit",
  ],
  image: IMG("1600585154340-be6161a56a0c", 1920),
  alt: "Kawasan Sang Dipa di perbukitan Candisari",
};

/** Section 2-4: ambience, taman, clubhouse. */
export const AMBIENCE = [
  {
    id: "gerbang",
    eyebrow: "Ambience",
    title: "Gerbang Utama Eksklusif",
    body: "Kemewahan yang menyambut setiap kepulangan Anda. Dirancang dengan presisi arsitektural tropis kontemporer dan sistem pengawasan berlapis untuk ketenangan privasi keluarga Anda seutuhnya.",
    image: IMG("1600585154526-990dced4db0d", 1200),
    alt: "Gerbang utama Sang Dipa",
    features: [
      { title: "Keamanan 24 Jam", body: "Patroli berkala" },
      { title: "Sistem RFID", body: "Akses nirkontak" },
      { title: "Gerbang Otomatis", body: "Barrier cerdas" },
      { title: "CCTV Terintegrasi", body: "Pemantauan 360°" },
    ],
  },
  {
    id: "taman",
    eyebrow: "Fasilitas",
    title: "Taman Sang Dipa",
    body: "Dedikasi 40% area kawasan untuk ruang terbuka hijau lestari. Menghadirkan suaka botani alami dengan jalur refleksi, danau retensi air alami, serta taman kontur yang menjaga ekosistem tanah perbukitan tetap sejuk dan asri sepanjang tahun.",
    image: IMG("1470071459604-3b5ec3a7fe05", 1200),
    alt: "Taman berkontur Sang Dipa",
    caption: "Hillside Panoramic Park & Reflexology Path",
    note: "Elevasi tertinggi menghadap panorama Semarang Bawah",
    zone: "Zone A",
    features: [],
  },
  {
    id: "clubhouse",
    eyebrow: "Fasilitas",
    title: "Clubhouse Sang Dipa",
    body: "Pusat kebugaran dan interaksi sosial eksklusif bagi para penghuni. Dilengkapi ruang perjamuan privat, dek santai terbuka, dan teras yoga yang menghadap langsung ke panorama lembah kota Semarang.",
    image: IMG("1571896349842-33c89424de2d", 1200),
    alt: "Clubhouse Sang Dipa",
    caption: "Infinity Leisure Pool & Sky Lounge",
    note: "Kapasitas 120 tamu untuk acara privat keluarga",
    features: [
      { title: "Ruang Serbaguna", body: "" },
      { title: "Playground Anak", body: "" },
      { title: "Kolam Renang", body: "" },
    ],
  },
];

/** Section 5: spesifikasi material & tipe hunian. */
export const SPESIFIKASI = {
  eyebrow: "Spesifikasi",
  titleMaterial: "Material & Konstruksi SNI",
  titleTypes: "Hunian Luas & Nyaman",
  intro:
    "Tersedia 3 pilihan tipe hunian eksklusif yang dirancang adaptif terhadap topografi perbukitan dan sirkulasi udara alami:",
  materials: [
    { no: "01", label: "Pondasi", value: "Tiang Pancang Mini Pile & Batu Kali" },
    { no: "02", label: "Struktur", value: "Beton Bertulang Standar SNI" },
    { no: "03", label: "Rangka Atap", value: "Baja Ringan Zincalume Anti-Karat" },
    { no: "04", label: "Penutup Atap", value: "Genteng Keramik Glazur Premium" },
    { no: "05", label: "Plafon", value: "Gypsum Board Rangka Galvanis" },
    { no: "06", label: "Dinding", value: "Bata Merah Plester Weatherbond" },
    { no: "07", label: "Lantai Utama", value: "Homogeneous Tile 80x80 Granit" },
    { no: "08", label: "Sanitair", value: "Toto Sanitary Eco-Washer Series" },
    { no: "09", label: "Kusen & Jendela", value: "Aluminium YKK Powder Coating" },
    { no: "10", label: "Daun Pintu", value: "Solid Engineered Wood Teak" },
    { no: "11", label: "Cat Exterior", value: "Jotun Jotashield Weather Extreme" },
    { no: "12", label: "Cat Interior", value: "Dulux Pentalite Smooth Silk" },
    { no: "13", label: "Daya Listrik", value: "3.500 VA / 4.400 VA Underground" },
    { no: "14", label: "Air Bersih", value: "Artesis Mandiri & Tandon 1.000L" },
  ],
  types: [
    {
      id: "t36",
      label: "Tipe 36/72",
      name: "Kompak Tropis",
      price: "Mulai Rp 1.45 Miliar",
      spec: "LB 36 m² / LT 72 m² • 2 Kamar Tidur • 1 Kamar Mandi • 1 Carport",
      image: IMG("1580587771525-78b9dba3b914", 900),
      alt: "Rumah tipe 36/72",
    },
    {
      id: "t45",
      label: "Tipe 45/84",
      name: "Modern Eksekutif",
      price: "Mulai Rp 1.85 Miliar",
      spec: "LB 45 m² / LT 84 m² • 3 Kamar Tidur • 2 Kamar Mandi • 1 Carport Kanopi",
      image: IMG("1568605114967-8130f3a36994", 900),
      alt: "Rumah tipe 45/84",
    },
    {
      id: "t60",
      label: "Tipe 60/96",
      name: "Villa Bertingkat",
      price: "Mulai Rp 2.45 Miliar",
      spec: "LB 60 m² / LT 96 m² • 3+1 Kamar Tidur • 3 Kamar Mandi • 2 Carport",
      image: IMG("1613490493576-7fde63acd811", 900),
      alt: "Rumah tipe 60/96",
    },
  ],
  footnote: "*Harga sudah termasuk PPN 11%, BPHTB, & Balik Nama SHM",
};

/** Section 6: galeri. */
export const GALERI = {
  eyebrow: "Arsitektur & Tata Ruang",
  title: "Galeri Visual & Blueprint Denah Sang Dipa",
  items: [
    "Fasad Tropis Kontemporer Kayu & Kaca Lebar",
    "Double-Height Living Room Berlimpah Cahaya Alami",
    "Kamar Tidur Utama dengan Balkon Panorama Lembah",
    "Gerbang Batu Alam Berkanopi Tropis Modern",
    "Taman Hijau Berkontur Alami Pegunungan Candisari",
    "Marketing Gallery dan Show Unit",
  ],
  blueprint: {
    label: "SANG DIPA – TIPE 36/72",
    floors: [
      { name: "Lantai 1", level: "±0.00", detail: "Carport, R. Tamu, Taman" },
      { name: "Lantai 2", level: "+3.60", detail: "2 KT, Balkon, KM Luas" },
    ],
    scale: "Skala Presisi 1:100",
    orientation: "Orientasi: Hadap Utara/Selatan",
  },
  showUnit: {
    title: "Ingin Melihat Show Unit Sang Dipa Secara Langsung?",
    body: "Marketing Gallery dan Show Unit buka setiap hari pukul 08:30 – 18:00 WIB. Nikmati penjemputan VIP dan pendampingan konsultan arsitektur kami.",
    cta: "Jadwalkan Survey",
    tag: "Kunjungan Lokasi Langsung",
  },
};
