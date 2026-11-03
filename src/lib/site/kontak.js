/**
 * Data dummy halaman Kontak (role pengguna).
 *
 * Teks diambil dari docs/site/kontak_sang_group_semarang/code.html.
 */

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const KONTAK = {
  hero: {
    eyebrow: "Tentang Rumah Impian Anda",
    title: "Mari Bicara Tentang Rumah Impian Anda",
    body: "Tim kami siap membantu Senin–Jumat, 08.00–17.00.",
    image: IMG("1600585154340-be6161a56a0c", 1400),
    alt: "Rumah tropis modern di perbukitan hijau",
  },
  channels: [
    { id: "telepon", label: "Telepon", value: "+62 (024) 841-2026", href: "tel:+62248412026" },
    { id: "whatsapp", label: "WhatsApp", value: "+62 812-3456-7890", href: "#" },
    { id: "email", label: "Email", value: "hello@sanggroup.id", href: "mailto:hello@sanggroup.id" },
    {
      id: "kantor",
      label: "Kantor Pemasaran",
      value: "Jl. Diponegoro No. 88, Semarang",
      href: "#kantor",
    },
  ],
  form: {
    title: "Kirim Pesan",
    nameLabel: "Nama Lengkap",
    namePlaceholder: "Contoh: Budi Santoso",
    phoneLabel: "Nomor WhatsApp",
    phonePlaceholder: "Contoh: 0812 3456 7890",
    emailLabel: "Email",
    emailPlaceholder: "Contoh: budi@email.com",
    clusterLabel: "Perumahan yang Diminati",
    clusters: [
      "Sang Dipa Residence (Candisari Hills)",
      "Sang Wira Residence (Tembalang)",
      "Sang Naya Residence (Sambiroto Park)",
    ],
    messageLabel: "Pesan",
    messagePlaceholder: "Ceritakan kebutuhan hunian Anda...",
    submit: "Kirim Pesan",
    privacy: "*Data Anda kami jaga kerahasiaannya.",
  },
  office: {
    title: "Kunjungi Kantor Kami",
    body: "Kami mengundang Anda untuk berkunjung langsung, merasakan atmosfer perbukitan sejuk, dan melihat detail arsitektur serta material premium rumah contoh secara nyata.",
    addressLabel: "Alamat Kantor & Gallery",
    address:
      "Jl. Diponegoro No. 88, Laha-Siranda, Gajahmungkur, Kota Semarang, Jawa Tengah 50232",
    hoursLabel: "Jam Operasional",
    hours: "Senin – Minggu: 08.30 – 17.30 WIB (Buka Setiap Hari)",
  },
};
