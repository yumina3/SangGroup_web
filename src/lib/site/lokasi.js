/**
 * Data dummy halaman Lokasi (role pengguna).
 *
 * Teks diambil dari docs/site/lokasi_sang_group_semarang/code.html.
 */

const IMG = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const LOKASI_HERO = {
  eyebrow: "Lokasi",
  title: "Sang Group Semarang",
  body: "Berada di dataran tinggi prestisius Candisari Hills & koridor metropolitan Semarang. Menghadirkan kawasan hunian eksklusif yang mutlak bebas banjir dengan hawa sejuk alami pegunungan.",
};

export const STRATEGIS = {
  title: "Lokasi Strategis",
  paragraphs: [
    "Kawasan Sang Group berdiri di atas bentang kontur alami Candisari Hills, Semarang. Elevasi 160–335 mdpl memberi pemandangan lembah kota yang menawan, dan udara di sini tetap sejuk sepanjang hari.",
    "Akses utama selebar 14 meter beraspal mulus dua jalur, dan gerbang tol Semarang–Solo bisa dicapai hanya dalam tujuh menit. Kawasan ini dikelilingi hutan lindung alami dan bebas dari risiko banjir.",
  ],
  quote: "Tenang seperti di pegunungan, dekat seperti di kota.",
  cta: "Lihat Master Plan",
  image: IMG("1506905925346-21bda4d32df4", 1200),
  alt: "Lanskap perbukitan hijau Semarang",
};

/**
 * Pemilih perumahan (section 3).
 * `mode` menentukan isi panel: peta atau panorama 360°.
 */
export const PETA_KAWASAN = {
  title: "Pilih Lokasi Perumahan",
  hint: "Klik salah satu perumahan untuk melihat letak dan suasana sekitarnya.",
  items: [
    {
      id: "dipa",
      short: "Sang Dipa",
      name: "Sang Dipa Residence",
      area: "Candisari Hills",
      distance: "6,2 km dari Simpang Lima",
      description:
        "Berdiri anggun di atas bentang kontur alami perbukitan Candisari dengan elevasi hingga 335 mdpl. Menghadirkan hawa sejuk alami sepanjang hari serta panorama lepas lembah kota Semarang yang memukau.",
      facts: [
        { label: "Akses ke Tol", value: "4 Menit (GT Jatingaleh)" },
        {
          label: "Karakteristik Lahan",
          value: "Kontur Bukit Bebas Banjir (160–335 mdpl)",
        },
        { label: "Legalitas", value: "Sertifikat SHM Murni & PBG" },
        { label: "Kisaran Harga", value: "Mulai Rp 1,95 Milyar", highlight: true },
      ],
      mapImage: IMG("1524661135-423995f22d0b", 1200),
      panorama: IMG("1600585154340-be6161a56a0c", 1600),
      alt: "Kawasan Sang Dipa Residence di perbukitan Candisari",
    },
    {
      id: "wira",
      short: "Sang Wira",
      name: "Sang Wira Residence",
      area: "Tembalang Corridor",
      distance: "11 km dari Simpang Lima",
      description:
        "Terhubung langsung dengan koridor pendidikan Tembalang dan akses tol Semarang–Solo. Dirancang untuk keluarga muda dengan taman bersama dan jalur pedestrian bebas kendaraan.",
      facts: [
        { label: "Akses ke Tol", value: "5 Menit (GT Tembalang)" },
        { label: "Karakteristik Lahan", value: "Dataran Terkontrol Bebas Banjir" },
        { label: "Legalitas", value: "Sertifikat SHM Murni & PBG" },
        { label: "Kisaran Harga", value: "Mulai Rp 1,65 Milyar", highlight: true },
      ],
      mapImage: IMG("1562774053-701939374585", 1200),
      panorama: IMG("1512917774080-9991f1c4c750", 1600),
      alt: "Kawasan Sang Wira Residence di Tembalang",
    },
    {
      id: "naya",
      short: "Sang Naya",
      name: "Sang Naya Residence",
      area: "Sambiroto Park",
      distance: "9 km dari Simpang Lima",
      description:
        "Hunian tepi danau di Sambiroto dengan konsep Biophilic Healing Park. Menghadirkan suasana tenang dengan akses cepat ke bandara dan kawasan industri Semarang.",
      facts: [
        { label: "Akses ke Tol", value: "7 Menit (GT Kaligawe)" },
        { label: "Karakteristik Lahan", value: "Tepi Danau Retensi Alami" },
        { label: "Legalitas", value: "Sertifikat SHM Murni & PBG" },
        { label: "Kisaran Harga", value: "Mulai Rp 1,25 Milyar", highlight: true },
      ],
      mapImage: IMG("1501785888041-af3ef285b470", 1200),
      panorama: IMG("1580587771525-78b9dba3b914", 1600),
      alt: "Kawasan Sang Naya Residence di Sambiroto",
    },
  ],
  modes: [
    { id: "peta", label: "Peta" },
    { id: "360", label: "Tampilan 360°" },
  ],
  direction: "UTARA 340°",
  dragHint: "Seret untuk melihat sekeliling",
  filters: ["Semua Kawasan", "Sang Dipa", "Sang Wira", "Sang Naya"],
  applyLabel: "Terapkan Filter",
  resetLabel: "Reset",
};

export const KEUNGGULAN = {
  eyebrow: "Keunggulan",
  title: "Semua yang Anda Butuhkan Ada di Sekitar",
  items: [
    {
      id: "komersial",
      title: "Fasilitas Umum & Komersial",
      body: "Kenyamanan hidup paripurna berpadu dengan kemudahan akses menuju pusat perbelanjaan, sarana pendidikan ternama, dan fasilitas kesehatan premium kota Semarang.",
      extra:
        "Dikelilingi restoran bintang ternama, SPBU modern dengan stasiun pengisian daya EV charger, supermarket keluarga premium, dan distrik sentra perbankan yang dapat dicapai hanya dalam 5 menit berkendara.",
      image: IMG("1441986300917-64674bd600d8", 900),
      alt: "Pusat perbelanjaan dan fasilitas umum",
    },
    {
      id: "asri",
      title: "Lingkungan Asri Bebas Polusi",
      body: "Pasokan oksigen murni tak terbatas berkat alokasi 40% area resapan hijau dan danau retensi alami. Menjamin kualitas udara higienis bebas debu industri khas dataran tinggi perbukitan Semarang Selatan.",
      image: IMG("1470071459604-3b5ec3a7fe05", 900),
      alt: "Lingkungan hijau dengan pepohonan rindang",
    },
    {
      id: "keamanan",
      title: "Keamanan & Privasi Terpadu 24 Jam",
      body: "Dilengkapi one-gate system dengan RFID otomatis, perimeter berpagar masif penuh, pengawasan kamera CCTV 360° resolusi tinggi, serta pos keamanan patroli bergilir di setiap klaster privat.",
      image: IMG("1558002038-1055907df827", 900),
      alt: "Sistem keamanan kawasan",
    },
    {
      id: "hunan",
      title: "Hunian Nyaman Berkelanjutan",
      body: "Arsitektur tropis kontemporer yang selaras sempurna dengan lanskap perbukitan. Menitikberatkan sistem cross-ventilation alami, clubhouse eksklusif, infinity pool, dan gaya hidup sehat berkelanjutan.",
      image: IMG("1600596542815-ffad4c1539a9", 900),
      alt: "Hunian tropis kontemporer",
    },
  ],
};

export const JARAK = {
  title: "Semua Dekat dari Sini",
  body: "Dari Candisari Hills, kota dan akses utama hanya hitungan menit.",
  items: [
    { distance: "9 km", label: "Bandara Ahmad Yani", time: "18 menit" },
    { distance: "11 km", label: "Stasiun Tawang", time: "20 menit" },
    { distance: "14 km", label: "Pusat Kota & Simpang Lima", time: "15 menit" },
    { distance: "3 km", label: "Gerbang Tol Jatingaleh", time: "7 menit" },
  ],
};

export const KUNJUNGAN = {
  title: "Datang dan Lihat Sendiri",
  body: "Kami antar keliling kawasan, gratis. Cukup pilih harinya.",
  image: IMG("1512917774080-9991f1c4c750", 1400),
  alt: "Tur langsung kawasan perumahan",
};
