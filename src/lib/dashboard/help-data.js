/**
 * Konten Pusat Bantuan agen.
 *
 * Teks panduan dan FAQ bersifat dokumentasi statis, bukan data bisnis. Status
 * sistem masih nilai contoh sampai modul monitoring tersambung; jangan
 * ditampilkan sebagai metrik produksi.
 */

export const HELP_QUICK_GUIDES = [
  {
    id: "tambah-listing",
    title: "Cara menambah listing",
    description:
      "Panduan langkah demi langkah pengisian spesifikasi kavling, penandaan titik peta, foto properti, dan pengiriman listing untuk diverifikasi admin.",
    href: "/dashboard/penjual/properti/baru",
    keywords: "tambah listing properti kavling foto peta koordinat verifikasi",
  },
  {
    id: "perbarui-status",
    title: "Cara memperbarui status properti",
    description:
      "Mengubah ketersediaan unit menjadi Tersedia, Dipesan, atau Terjual, serta menyesuaikan harga dan data listing yang sudah terbit.",
    href: "/dashboard/penjual/properti",
    keywords: "status ketersediaan tersedia dipesan terjual harga ubah properti",
  },
  {
    id: "tindak-lanjut",
    title: "Cara menindaklanjuti pengajuan",
    description:
      "Alur memproses minat calon pembeli dari halaman Pengajuan Masuk: konfirmasi jadwal survei, catat hasil, lalu lanjutkan ke Deals/Pipeline.",
    href: "/dashboard/penjual/pengajuan",
    keywords: "pengajuan leads kunjungan survei deals pipeline tindak lanjut",
  },
  {
    id: "perbaiki-listing",
    title: "Cara memperbaiki listing yang ditolak",
    description:
      "Membaca catatan verifikasi admin, melengkapi data atau foto yang kurang, lalu mengirim ulang listing untuk diverifikasi.",
    href: "/dashboard/penjual/properti?listing=REJECTED",
    keywords: "ditolak revisi verifikasi admin perbaiki listing kirim ulang",
  },
];

export const HELP_FAQS = [
  {
    id: "verifikasi-listing",
    question: "Berapa lama proses verifikasi listing baru oleh tim admin SANG Group?",
    answer:
      "Verifikasi data, foto, dan titik koordinat dilakukan maksimal 1 x 24 jam kerja (Senin–Jumat). Anda akan melihat status listing berubah menjadi Terverifikasi dan listing otomatis tampil di katalog publik setelah disetujui.",
    keywords: "verifikasi listing baru admin lama menunggu disetujui",
  },
  {
    id: "ubah-harga",
    question: "Apakah saya bisa mengubah harga unit yang sudah terbit di katalog publik?",
    answer:
      "Bisa. Buka Properti Saya, pilih Ubah pada listing yang dimaksud, lalu perbarui harga. Perubahan pada field kunci listing yang sudah terverifikasi akan mengirim ulang listing ke antrean verifikasi admin sebelum tampil kembali di katalog.",
    keywords: "ubah harga unit katalog publik terbit verifikasi ulang",
  },
  {
    id: "jadwal-survei",
    question: "Bagaimana cara membatalkan atau menjadwalkan ulang survei calon pembeli?",
    answer:
      "Buka Pengajuan Masuk, pilih pengajuan yang akan diubah, lalu gunakan tindakan Jadwalkan Ulang atau Tolak dengan catatan. Lakukan sebelum jadwal agar calon pembeli mendapat pemberitahuan dan riwayat tindak lanjut tetap tercatat.",
    keywords: "batal jadwal survei kunjungan reschedule pengajuan",
  },
  {
    id: "format-foto",
    question: "Apa format foto dan dokumen yang didukung saat menambah listing?",
    answer:
      "Foto properti menerima format JPG atau PNG, maksimal 2 MB per foto, dan maksimal 8 foto per listing. Foto pertama otomatis menjadi foto utama. Pastikan titik koordinat dan data legalitas diisi lengkap sebelum mengirim listing.",
    keywords: "format foto jpg png ukuran maksimal dokumen legalitas",
  },
  {
    id: "pengajuan-tidak-muncul",
    question: "Mengapa pengajuan baru tidak muncul di halaman saya?",
    answer:
      "Pengajuan hanya tampil untuk properti yang terdaftar atas nama akun Anda. Periksa filter di halaman Pengajuan Masuk, pastikan listing sudah terverifikasi, dan gunakan kolom pencarian untuk menemukan nama pembeli atau properti.",
    keywords: "pengajuan tidak muncul filter properti pembeli",
  },
];

export const HELP_SUPPORT = {
  eyebrow: "Dukungan Teknis & Operasional",
  title: "Butuh bantuan lain?",
  description:
    "Tim Administrator dan Helpdesk SANG Group siap mendampingi kendala teknis, verifikasi berkas, dan sinkronisasi data properti Anda.",
  email: "hello@sanggroup.id",
  adminEmail: "admin.support@sanggroup.id",
  whatsapp: "+62 812-3456-7890",
  whatsappHref: "https://wa.me/6281234567890",
  hours: "Senin – Jumat, 08.00 – 17.00 WIB",
  responseNote: "Rata-rata waktu respons tiket bantuan: < 15 menit pada jam kerja.",
};

export const HELP_SYSTEM_STATUS = {
  label: "Contoh",
  rows: [
    { label: "Server GIS Semarang Engine", value: "Online (99.98%)" },
    { label: "Latensi Jaringan", value: "24 ms", tone: "positive" },
    { label: "Sinkronisasi Basis Data Supabase", value: "Berjalan Normal" },
  ],
  updateNote: "Data contoh — monitoring produksi belum tersambung",
  build: "Build v0.1.0",
};
