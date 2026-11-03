/**
 * Data dummy halaman Fasilitas (role pengguna).
 *
 * Teks diambil dari docs/site/fasilitas_sang_group_semarang/code.html.
 * Section berselang-seling: krem (ivory) dan hijau (brand-dark).
 */

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const FASILITAS_HERO = {
  eyebrow: "Kawasan Terintegrasi Unggulan",
  title: "Fasilitas",
  body: "Kawasan hunian terpadu SANG Group dirancang dengan ekosistem fasilitas terlengkap di perbukitan Semarang — memadukan keasrian alam danau, institusi pendidikan unggulan, pusat olahraga modern, hingga sistem keamanan terintegrasi untuk kenyamanan lintas generasi.",
  image: IMG("1470071459604-3b5ec3a7fe05", 1920),
  alt: "Kawasan hijau terpadu dengan pepohonan rindang",
};

/**
 * Delapan fasilitas utama. Urutannya mengikuti code.html.
 * `tone` menentukan latar section: "cream" atau "dark".
 */
export const FASILITAS_ITEMS = [
  {
    id: "taman-danau",
    index: "01",
    category: "Ekowisata Alami",
    title: "Taman & Danau",
    body: "Ruang terbuka hijau seluas 40% dari total kawasan dengan danau alami berair jernih, area resapan air mandiri, serta ekosistem vegetasi perbukitan sejuk yang menjaga kualitas udara tetap prima sepanjang tahun bagi kesejahteraan keluarga Anda.",
    badge: "Danau Alami & Suaka Botani",
    image: IMG("1501785888041-af3ef285b470", 1000),
    alt: "Danau alami dikelilingi pepohonan",
    tone: "cream",
  },
  {
    id: "pendidikan",
    index: "02",
    category: "Edukasi Generasi Unggul",
    title: "Institusi Pendidikan",
    body: "Akses mudah dan aman menuju institusi pendidikan bertaraf unggul di dalam dan sekitar kawasan. Dirancang untuk menunjang tumbuh kembang generasi penerus melalui fasilitas belajar modern, area hijau luas, dan jalur pedestrian terpadu bebas kendaraan cepat.",
    badge: "Kampus Ramah Lingkungan",
    image: IMG("1562774053-701939374585", 1000),
    alt: "Gedung kampus dengan taman hijau",
    tone: "dark",
  },
  {
    id: "spbu",
    index: "03",
    category: "Konektivitas Kendaraan",
    title: "SPBU & EV Station",
    body: "Kemudahan mobilitas harian didukung oleh kehadiran stasiun pengisian bahan bakar resmi di koridor terdepan kawasan. Dilengkapi minimarket 24 jam, stasiun pengisian kendaraan listrik (EV Charging Station), dan layanan penunjang berkendara.",
    badge: "Pengisian Ramah Lingkungan",
    image: IMG("1592838064575-70ed626d3a0e", 1000),
    alt: "Stasiun pengisian kendaraan listrik",
    tone: "cream",
  },
  {
    id: "arcade",
    index: "04",
    category: "Destinasi Belanja",
    title: "Lifestyle Shopping Arcade",
    body: "Pusat gaya hidup dan belanja keluarga menghadirkan ragam gerai ritel terkemuka, coffee shop bernuansa alam terbuka, serta area kuliner keluarga yang strategis hanya beberapa menit dari hunian Anda tanpa perlu menembus kemacetan kota.",
    badge: "Ritel Modern & Alfresco Dining",
    image: IMG("1441986300917-64674bd600d8", 1000),
    alt: "Deretan gerai ritel dengan area terbuka",
    tone: "dark",
  },
  {
    id: "pasar",
    index: "05",
    category: "Bahan Pangan Segar",
    title: "Pasar Bersih Modern",
    body: "Sentra kebutuhan pangan harian dengan konsep pasar bersih yang nyaman, teratur, dan higienis. Menyediakan aneka komoditas segar langsung dari petani lokal, bahan organik, hingga area kuliner tradisional Semarang dalam suasana berbelanja yang representatif.",
    badge: "Higienis, Rapi & Terkurasi",
    image: IMG("1488459716781-31db52582fe9", 1000),
    alt: "Pasar modern dengan komoditas segar",
    tone: "cream",
  },
  {
    id: "keamanan",
    index: "06",
    category: "Proteksi Presisi",
    title: "Keamanan Terpadu 24 Jam",
    body: "Perlindungan menyeluruh bagi setiap penghuni melalui sistem one-gate terpadu, pemindaian kartu RFID nirsentuh, patroli berkala 24/7, serta jaringan pemantauan CCTV canggih di setiap sudut strategis klaster demi rasa aman maksimal.",
    badge: "One-Gate System & RFID Barrier",
    image: IMG("1558002038-1055907df827", 1000),
    alt: "Kamera pengawas keamanan kawasan",
    tone: "dark",
  },
  {
    id: "jogging",
    index: "07",
    category: "Jalur Kebugaran Panorama",
    title: "Jogging & Cycling Track",
    body: "Jalur lari dan bersepeda khusus yang aman sepanjang bukit dengan kontur elevasi yang menyegarkan. Dilengkapi marka jarak, pencahayaan taman malam hari, dan titik istirahat dengan panorama terbuka menghadap lanskap perbukitan Semarang.",
    badge: "Jalur Bebas Kendaraan Motor",
    image: IMG("1571008887538-b36bb32f4571", 1000),
    alt: "Jalur lari di antara pepohonan",
    tone: "cream",
  },
  {
    id: "taman-aktif",
    index: "08",
    category: "Ruang Temu Keluarga",
    title: "Taman Aktif & Pasif",
    body: "Integrasi harmonis antara taman bermain interaktif anak yang aman berlantai rumput sintetis higienis dan area taman kontemplatif yang hening untuk relaksasi. Tempat ideal untuk berinteraksi antar-keluarga sekaligus menikmati keheningan alam pegunungan.",
    badge: "Area Relaksasi & Bermain Ramah Anak",
    image: IMG("1519331379826-f10be5486c6f", 1000),
    alt: "Taman bermain anak di kawasan hijau",
    tone: "dark",
  },
];

/** Section khusus: klub olahraga dengan empat kartu. */
export const OLAHRAGA = {
  eyebrow: "Kebugaran & Vitalitas",
  title: "Klub Olahraga Sang Group",
  body: "Menghadirkan standar gaya hidup aktif dengan kompleks olahraga terintegrasi: lapangan tenis privat berstandar ITF, arena basket serbaguna, kolam renang infinity berpanorama perbukitan, serta pusat kebugaran dan studio yoga modern.",
  items: [
    {
      id: "tenis",
      title: "Lapangan Tenis Outdoor",
      body: "Permukaan hard-court premium dengan sistem penerangan malam hari untuk pertandingan persahabatan kapan saja.",
      tag: "ITF Regulation",
      image: IMG("1554068865-24cecd4e34b8", 800),
      alt: "Lapangan tenis outdoor",
    },
    {
      id: "basket",
      title: "Arena Bola Basket",
      body: "Fasilitas multifungsi bagi komunitas penghuni dari segala usia untuk latihan rutin dan kompetisi keluarga.",
      tag: "Half & Full Court",
      image: IMG("1546519638-68e109498ffc", 800),
      alt: "Arena bola basket",
    },
    {
      id: "pool",
      title: "Infinity Lap Pool",
      body: "Kolam renang dewasa dan anak dengan pemandangan terbuka lembah Semarang yang menenangkan indera.",
      tag: "Panoramic Hillside",
      image: IMG("1571896349842-33c89424de2d", 800),
      alt: "Kolam renang infinity dengan panorama",
    },
    {
      id: "gym",
      title: "Gym & Studio Yoga",
      body: "Peralatan kardio dan beban mutakhir dipadukan dengan ruang meditasi beriklim sejuk perbukitan.",
      tag: "Peralatan Lengkap",
      image: IMG("1534438327276-14e5300c3a48", 800),
      alt: "Pusat kebugaran dan studio yoga",
    },
  ],
};

export const FASILITAS_CTA = {
  eyebrow: "Langkah Menuju Kenyamanan Nyata",
  title: "Rasakan Langsung Kenyamanannya",
  body: "Kunjungi Marketing Gallery kami atau jadwalkan tur privat bersama konsultan properti kami untuk mengeksplorasi seluruh fasilitas kawasan SANG Group.",
};
