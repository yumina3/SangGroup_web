# PRD v4.0: Sang Group — Sistem Informasi Jual Beli Perumahan (GIS)

| | |
|---|---|
| Versi | 4.0 (diselaraskan dengan Technical Requirements Full-Stack Web Development) |
| Tanggal | 29 Oktober 2026 |
| Status | Revisi terpadu berdasarkan PRD v3.1, SRS v3.1, dan Technical Requirements terbaru |
| Mata kuliah | Website Sistem Informasi Jual Beli Perumahan (GIS) |
| Pemilik produk | Kelompok 15 |
| Brand | SANG Group |
| Proyek awal | Sang Dipa Residence, Sang Wira Residence, Sang Naya Residence |
| Stack | Next.js, Supabase (Auth, Postgres, Storage), GitHub, Vercel |
| Dokumen terkait | SRS v4.0 dan Technical Requirements — Full-Stack Web Development |

Dokumen ini merupakan revisi terpadu PRD v3.1 dengan SRS v3.1 dan Technical Requirements terbaru. Dokumen ini ditulis sebagai acuan tim dan konteks implementasi. Kebutuhan bisnis sebelumnya dipertahankan kecuali jika bertentangan dengan standar teknis terbaru. Semua nama, harga, dan identitas di dalamnya fiktif.

> Informasi proyek, harga, stok, foto, koordinat, dan site plan harus dikonfirmasi kepada SANG Group sebelum dipublikasikan sebagai data resmi. Selama belum dikonfirmasi, data tampil dengan label "Data simulasi" (bagian 11.6).

---

## 1. Ringkasan produk

Sang Group adalah website penjualan perumahan dengan peta GIS. Satu developer (Sang Group) memasarkan tiga perumahan di Semarang: **Sang Dipa** (Candisari), **Sang Wira** (Tembalang), dan **Sang Naya** (Sambiroto).

- Pengunjung menelusuri perumahan, melihat sebaran properti di peta, dan mengajukan kunjungan atau minat beli.
- Agen (penjual) mengisi listing, foto, lokasi, dan ketersediaan, lalu menindaklanjuti pengajuan pembeli.
- Admin memverifikasi listing, mengelola pengguna dan kategori, memoderasi data, dan melihat rekap properti.

### 1.1 Tujuan

1. Alur minimum lolos uji langsung di URL Vercel: agen mengisi properti dan lokasi → admin memverifikasi → properti tampil di katalog dan peta → pembeli mengajukan kunjungan → agen memperbarui tindak lanjut dan status.
2. Seluruh ketentuan teknis terbaru dipetakan pada bagian 14, termasuk validasi tiga lapisan, backend API sendiri, Web Push, worker antrean persisten, object storage, observability, dan pengujian.
3. Tampilan mengikuti desain Stitch: situs publik bernuansa hijau tua dan emas, dashboard dengan sidebar hijau tua dan font Plus Jakarta Sans.

**Sasaran produk dan indikator keberhasilan**

| ID | Sasaran | Indikator |
|---|---|---|
| G-01 | Memperkenalkan Sang Group dan tiga perumahan | Pengunjung memahami hubungan brand dan perumahan, lalu membuka halaman masing-masing |
| G-02 | Mempermudah penemuan properti | Katalog, filter, detail, dan peta menampilkan data yang konsisten |
| G-03 | Mengubah minat menjadi prospek | Pembeli dapat mengajukan kunjungan atau minat beli dan melihat statusnya |
| G-04 | Memudahkan pengelolaan listing | Agen mengelola listing miliknya, admin memverifikasi sebelum listing tayang |
| G-05 | Menjaga integritas data | Data tersimpan di Supabase dan bertahan setelah refresh dan login ulang |
| G-06 | Pengalaman responsif dan mudah diakses | Peta dan formulir dapat dipakai di ponsel dan desktop |
| G-07 | Mendukung demo dan deployment | Aplikasi berjalan di Vercel dan terhubung ke Supabase |
| G-08 | Menjaga kejujuran data | Data publik yang tampil sudah dikonfirmasi Sang Group atau ditandai "Data simulasi" |

### 1.2 Di luar cakupan

- Pembayaran nyata. Pembayaran hanya berupa pencatatan dan konfirmasi status.
- Banyak developer atau marketplace multi-penjual.
- Integrasi kadaster/BPN, ekspor shapefile, dan fitur "GIS engine" yang sempat muncul di mockup Stitch. Itu karangan generator, bukan kebutuhan.
- Chat realtime. Halaman Messages bersifat opsional (bagian 6).
- Simulasi KPR dan integrasi WhatsApp API. Kontak WhatsApp cukup berupa tautan `wa.me`.
- Persetujuan kredit atau perhitungan KPR oleh sistem.
- Kontrak jual beli digital, tanda tangan elektronik, dan pengurusan legalitas properti.
- Integrasi otomatis dengan CRM atau ERP developer.
- Penentuan harga otomatis berbasis AI.
- Aplikasi mobile native.
- Penjaminan ketersediaan unit otomatis tanpa data operasional dari developer.
- Publikasi data pribadi pemilik atau calon pembeli. Nomor WhatsApp dan email pembeli hanya terlihat oleh agen pemilik listing terkait dan admin.
- Peta kavling yang diklaim akurat tanpa site plan resmi dan koordinat yang disetujui.
- Memakai logo, foto, denah, atau materi promosi pihak lain tanpa izin.

### 1.3 Masalah dan peluang

Calon pembeli mengumpulkan informasi rumah dari banyak sumber, sedangkan tim pemasaran perlu menyajikan spesifikasi, foto, lokasi, dan status ketersediaan secara konsisten. Website terpusat dapat:

- memperkenalkan Sang Group dan portofolio perumahannya di satu tempat;
- memudahkan calon pembeli membandingkan tipe rumah dan lokasi;
- menampilkan lokasi properti secara geografis, bukan hanya lewat alamat;
- mengumpulkan minat dan permintaan kunjungan secara terstruktur;
- membantu tim marketing memperbarui listing dan menindaklanjuti prospek.

Peluang ini masih hipotesis produk dan perlu divalidasi dengan Sang Group. Dokumen ini tidak mengklaim bahwa perusahaan sudah menyetujui atau membutuhkan semua fitur.

### 1.4 Fitur lanjutan (setelah MVP)

- Site plan interaktif dan pemilihan nomor kavling, hanya bila developer menyediakan dan mengizinkan pemakaian site plan.
- Perbandingan beberapa properti.
- Pencarian radius atau jarak dari titik tertentu.
- Integrasi WhatsApp Business atau CRM setelah kontak dan persetujuan perusahaan dikonfirmasi.
- Analitik funnel calon pembeli dan sumber prospek (versi dasar sudah ada di halaman opsional Conversion Funnel).
- Panel multi-proyek untuk portofolio yang lebih luas.
- Bahasa Inggris penuh (toggle ID/EN di mockup baru berupa tampilan).

---

## 2. Perubahan terhadap draft sebelumnya

| Topik | Draft sebelumnya | Versi ini (mengikuti desain) |
|---|---|---|
| Nama brand | Property Kita | Sang Group |
| Cakupan | Banyak proyek dan developer, penelusuran per wilayah | Satu developer, tiga perumahan |
| Peta 360° | Fitur tambahan | Masuk di halaman Lokasi (mode "Peta" dan "Tampilan 360°") |
| Tindak lanjut | Status tunggal | Pipeline 7 tahap di tingkat pengajuan, status properti tetap 3 (tersedia, dipesan, terjual) |
| Dashboard | Daftar halaman umum | Mengikuti sidebar yang sudah didesain: 14 menu agen, 8 menu admin |
| Halaman Products | Katalog generik | Halaman per perumahan dengan 6 section (ambience, fasilitas, spesifikasi, cluster type, denah) |

Halaman yang wajib menurut tugas tetapi **desain ada di docs folder desain **: katalog dan peta publik, detail properti, dashboard pembeli, login/register, dan jalur "Pasang Properti". Spesifikasi minimalnya ada di bagian 7 dan daftar celah ada di bagian 16.

**Sumber penggabungan.** Dokumen ini adalah PRD v3.0 yang diperkaya dengan bagian dari PRD v1.0 Kelompok 15. Yang ditambahkan dari PRD v1.0: masalah dan peluang (1.3), sasaran G-01 sampai G-08 (1.1), non-goals tambahan (1.2), fitur lanjutan (1.4), target pengguna (3.2), prinsip UX dan konten (5.5), rute `/products` dan 404 (6.1), alur pengguna utama (7.5), rekap pengajuan di admin (FR-ADM-06), tanggal pembaruan di katalog dan detail (FR-PUB-07, FR-PUB-08), aturan label "Data simulasi" (11.6), risiko dan mitigasi (17), serta keputusan terbuka (18). Struktur, rute, model data, dan aturan bisnis tetap mengikuti PRD v3.0.

---

## 3. Peran dan hak akses

| Kemampuan | Pengunjung | Pembeli | Penjual/Agen | Admin |
|---|:-:|:-:|:-:|:-:|
| Melihat halaman publik, katalog, peta, dan detail (listing terverifikasi) | ya | ya | ya | ya |
| Mengirim form kontak dan form penawaran | ya | ya | ya | ya |
| Menyimpan favorit | tidak | ya | tidak | tidak |
| Mengajukan kunjungan atau minat beli | tidak | ya | tidak | tidak |
| Melihat status pengajuan sendiri | tidak | ya | tidak | tidak |
| Mengelola listing miliknya (isi, foto, koordinat, ketersediaan) | tidak | tidak | ya | tidak |
| Mengirim listing untuk verifikasi | tidak | tidak | ya | tidak |
| Menindaklanjuti pengajuan atas listing miliknya | tidak | tidak | ya | tidak |
| Memverifikasi listing (setujui atau tolak) | tidak | tidak | tidak | ya |
| Mengelola pengguna dan menyetujui akun agen | tidak | tidak | tidak | ya |
| Mengelola kategori (tipe properti dan cluster) | tidak | tidak | tidak | ya |
| Memoderasi data (sembunyikan, hapus, abaikan) | tidak | tidak | tidak | ya |
| Melihat rekap seluruh properti | tidak | tidak | tidak | ya |
| Mengubah peran sendiri | tidak | tidak | tidak | tidak |

### 3.1 Siklus akun

- **Pembeli** mendaftar sendiri di `/register`. Akun langsung aktif.
- **Agen** mendaftar lewat tombol "Pasang Properti" (`/pasang-properti`). Status akun `pending`. Agen tidak bisa masuk dashboard sampai admin menyetujuinya di halaman Users.
- **Admin** dibuat lewat seed atau Supabase. Tidak ada pendaftaran publik untuk admin.
- Peran ditetapkan oleh trigger database dari metadata pendaftaran yang hanya menerima `buyer` atau `agent`. Peran tidak pernah dibaca dari form profil.
- Akun `inactive` tidak bisa masuk.

### 3.2 Target pengguna dan kebutuhan

| Pengguna | Kebutuhan utama |
|---|---|
| Pengunjung umum dan calon pembeli | Mengenal Sang Group dan perumahannya; membandingkan lokasi, tipe, harga, luas, fasilitas, dan foto; punya cara mudah untuk meminta kunjungan atau menyatakan minat |
| Pembeli terdaftar | Menyimpan properti favorit; mengajukan kunjungan atau minat beli; melihat riwayat dan status pengajuan sendiri |
| Penjual/agen/marketing | Mengelola listing yang menjadi tanggung jawabnya; memperbarui foto, spesifikasi, koordinat, harga, dan ketersediaan; menindaklanjuti pengajuan terkait listing miliknya |
| Admin | Mengelola akun dan kategori; memverifikasi dan memoderasi listing; mengelola data cluster; meninjau status listing; melihat rekap properti dan pengajuan |

---

## 4. Arsitektur

### 4.1 Teknologi dan batas implementasi

| Lapisan | Keputusan |
|---|---|
| Frontend dan backend | Next.js App Router, JavaScript; TypeScript diperbolehkan dan disarankan untuk tipe yang lebih aman |
| Backend API | Next.js Route Handlers dan/atau Server Actions; semua mutasi dan query privat melewati backend milik aplikasi |
| Database | PostgreSQL; boleh di-host pada Supabase PostgreSQL, tetapi akses data bisnis menggunakan koneksi PostgreSQL langsung dari server melalui Prisma, Drizzle, atau `pg` |
| ORM/driver | Prisma menjadi pilihan default agar skema dan migration terkelola; `pg`/Drizzle boleh digunakan bila tim konsisten |
| Auth | Supabase Auth boleh dipakai untuk identitas dan sesi; backend harus memverifikasi sesi/token dan mengambil role/ownership dari data server/database |
| Validasi | Zod pada frontend dan backend; constraint PostgreSQL sebagai lapisan ketiga |
| Peta | Leaflet dan `react-leaflet`, tile OpenStreetMap |
| Grafik | Recharts |
| Object storage | S3-compatible storage, Cloudflare R2, Amazon S3, atau MinIO; PostgreSQL menyimpan metadata dan key/path file |
| Web Push | Service Worker, VAPID, `web-push` |
| Background worker | Proses terpisah menggunakan BullMQ + Redis atau antrean persisten setara |
| Logging | Pino atau Winston; log worker dan backend |
| Error monitoring | Sentry atau setara bila tersedia |
| Version control dan deployment | Git/GitHub; aplikasi web di Vercel atau platform setara; worker dijalankan pada layanan yang mendukung proses persisten |

**Larangan teknis:** Jangan menggunakan Supabase client/PostgREST atau layanan API sejenis sebagai pengganti backend aplikasi. Query data bisnis harus melalui Prisma/Drizzle/`pg` dari server Next.js. Supabase Auth masih dapat dipakai untuk autentikasi, dan Supabase dapat menjadi host PostgreSQL, selama akses data aplikasi tetap melalui backend sendiri.

### 4.2 Arsitektur logis

```text
Browser
  ├─ Next.js UI + form validation
  ├─ Service Worker (push + notificationclick)
  └─ HTTPS request
       ↓
Next.js Route Handler / Server Action
  ├─ autentikasi, otorisasi, ownership
  ├─ validasi Zod dan aturan bisnis
  ├─ Prisma/Drizzle/pg
  ├─ object storage signed upload/download
  └─ enqueue push job setelah transaksi berhasil
       ↓
PostgreSQL ── metadata bisnis, push subscriptions, audit/error records
       ↓
Persistent queue (Redis/BullMQ atau setara)
       ↓
Background worker terpisah ── web-push + VAPID
       ↓
Browser Push Service → Service Worker → notifikasi
```

### 4.3 Environment variables

| Variabel | Penggunaan |
|---|---|
| `DATABASE_URL` | Koneksi PostgreSQL dari backend/worker; tidak pernah diekspos ke browser |
| `DIRECT_URL` | Koneksi langsung untuk migration bila diperlukan oleh provider/ORM |
| `NEXT_PUBLIC_SUPABASE_URL` | Hanya bila Supabase Auth dipakai |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Hanya untuk alur Auth yang memang memerlukannya; bukan untuk query data bisnis |
| `SUPABASE_SERVICE_ROLE_KEY` | Tidak dibutuhkan untuk query bisnis; bila dipakai untuk administrasi Auth, server-only dan tidak boleh masuk browser/repository |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Object storage; seluruh kredensial server-only |
| `VAPID_PUBLIC_KEY` | Kunci publik untuk konfigurasi Web Push; dapat dipaparkan ke browser sebagai konfigurasi publik |
| `VAPID_PRIVATE_KEY` | Server/worker saja |
| `VAPID_SUBJECT` | Identitas kontak VAPID |
| `REDIS_URL` | Koneksi queue worker; server/worker saja |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public key yang digunakan browser saat membuat subscription |

Sediakan `.env.example` tanpa secret asli. `.env.local` dan file environment lain harus masuk `.gitignore`. Jangan mengirim kredensial storage, database, Redis, atau private key ke client.

### 4.4 Struktur folder acuan

```text
src/
  app/                  halaman publik, auth, dashboard
  app/api/              Route Handlers
  components/           ui/, layout/, map/, property/, dashboard/
  lib/
    auth/               pemeriksaan sesi, role, ownership
    db/                 client Prisma/Drizzle
    validators/         skema Zod
    storage/            object storage dan signed URL
    push/               pendaftaran subscription/enqueue job
    logging/            logger
prisma/
  schema.prisma
  migrations/
  seed.js
public/
  service-worker.js
worker/
  push-worker.js
  queue.js
docs/
  ERD.md
  ARCHITECTURE.md
```

### 4.5 Deployment aplikasi dan worker

Aplikasi Next.js dapat di-deploy ke Vercel. Background worker tidak boleh bergantung pada fungsi serverless yang berhenti setelah request selesai; deploy worker sebagai proses terpisah pada platform yang mendukung proses persisten. Redis/queue harus dapat diakses oleh aplikasi dan worker. Dokumentasi wajib menjelaskan URL deployment, migrasi, seed, konfigurasi VAPID, queue, dan cara menjalankan worker lokal maupun deployment.

## 5. Design system

### 5.1 Token

| Token | Nilai patokan | Pemakaian |
|---|---|---|
| `--green-900` | `#0F4C3A` | Band gelap, tombol sekunder, teks aksen situs publik |
| `--green-sidebar` | `#14412F` | Sidebar dashboard |
| `--gold` | `#C8963E` | Aksen, tombol utama, garis dekoratif, tab aktif |
| `--bg-public` | `#F5F5F2` | Latar situs publik (tekstur kertas halus) |
| `--bg-dashboard` | `#F4F6F4` | Latar dashboard |
| `--ink` | `#1F2A26` | Teks utama |
| `--muted` | `#6B7A74` | Teks bantu |
| `--success` / `--warning` / `--danger` / `--info` | `#2E9E5B` / `#E0A21B` / `#D64545` / `#2F6FB5` | Status |

Nilai heksa adalah patokan. Ambil nilai final dari hasil Stitch lalu simpan sebagai variabel CSS tunggal di `globals.css`.

### 5.2 Tipografi dan bentuk

- Font: Plus Jakarta Sans untuk semua teks, termasuk angka. Tanpa font serif, kecuali wordmark logo.
- Skala: judul halaman 24px bold, judul section 16px bold, teks dan isi tabel 14px, keterangan minimal 13px, angka besar 32 sampai 36px extra-bold.
- Situs publik: sudut persegi, heading light-weight, garis emas tipis, tanpa bayangan tebal.
- Dashboard: radius 8px untuk kartu, input, dan tombol; radius 6px untuk tag; avatar bulat. Tanpa bentuk pil, tanpa glow, tanpa gradien.
- Jarak dashboard: padding halaman 24px, jarak antar kartu 24px, padding dalam kartu 24px, tinggi baris tabel 56px.

### 5.3 Tag status

| Domain | Nilai (label) | Warna |
|---|---|---|
| Ketersediaan | `available` (Tersedia), `booked` (Dipesan), `sold` (Terjual) | hijau, kuning, abu |
| Verifikasi | `draft` (Draft), `pending` (Menunggu Verifikasi), `verified` (Terverifikasi), `rejected` (Ditolak) | abu, kuning, hijau, merah |
| Pengajuan | `new` (Baru), `consultation` (Konsultasi), `scheduled` (Dijadwalkan), `visit_done` (Selesai Kunjungan), `negotiation` (Negosiasi), `deal` (Deal), `cancelled` (Batal) | abu-biru, biru, kuning, teal, oranye, hijau, merah |
| Akun | `active` (Aktif), `inactive` (Nonaktif), `pending` (Menunggu Persetujuan) | hijau, abu, kuning |

Status tidak dibedakan dengan warna saja: setiap tag selalu memuat label teks.

### 5.4 Pola komponen dashboard

- Sidebar 240px hijau tua. Logo "SANG GROUP / ESTATE SYSTEM", item aktif memakai latar hijau lebih terang dan garis emas 3px di kiri. Label sidebar tetap berbahasa Inggris seperti desain; isi halaman berbahasa Indonesia.
- Top bar 64px: kolom pencarian, ikon lonceng, nama dan peran pengguna. Tidak ada tab bernomor dan tidak ada kartu header tambahan.
- Kartu KPI: label dan ikon kecil di baris atas, angka besar, satu baris keterangan dengan titik warna. Semua kartu putih dan berstruktur sama.
- Setiap daftar atau tabel punya: pencarian, filter, pagination, keadaan kosong (satu kalimat dan satu tombol), dan skeleton saat memuat.
- Tombol kirim menampilkan spinner dan nonaktif selama proses. Hasil tindakan tampil sebagai toast di kanan atas. Tindakan merusak selalu memakai dialog konfirmasi.

### 5.5 Prinsip UX dan konten

- Beranda memperkenalkan Sang Group lebih dulu, baru mengarahkan pengunjung ke tiga perumahan.
- Ajakan utama konsisten di seluruh situs: "Jelajahi Properti", "Lihat Lokasi", "Ajukan Kunjungan".
- Di ponsel peta tidak mengambil alih seluruh layar. Daftar properti tetap bisa dibuka lewat tab "Daftar" dan "Peta".
- Animasi dekoratif tidak boleh menutupi harga, peta, atau formulir.
- Semua gambar punya teks alt dan semua kontrol dapat dioperasikan dengan keyboard.
- File logo final beresolusi memadai dan izin pemakaian logo, foto, dan denah disiapkan sebelum publikasi. Materi pihak lain tidak dipakai tanpa izin.
- Data yang belum dikonfirmasi diberi label "Data simulasi" (bagian 11.6).

---

## 6. Peta halaman

Prioritas: **W** = wajib menurut tugas, **P** = pendukung (ada di desain, bukan syarat tugas), **O** = opsional. Kolom desain: **Ada** = sudah dibuat atau prompt Stitch sudah tersedia, **Belum** = belum ada.

### 6.1 Situs publik dan autentikasi

| Rute | Halaman | Akses | Prioritas | Desain |
|---|---|---|---|---|
| `/` | Landing page (halaman utama) | publik | W | Ada, perlu section peta dan katalog ringkas |
| `/about` | Tentang | publik | O | Belum |
| `/products` | Daftar tiga perumahan | publik | P | Belum |
| `/products/[slug]` | Products per perumahan (Sang Dipa, Sang Wira, Sang Naya) | publik | P | Ada (Sang Dipa, dua lainnya memakai template sama) |
| `/facilities` | Fasilitas | publik | P | Ada |
| `/location` | Lokasi dengan pemilih perumahan, peta, dan 360° | publik | P | Ada |
| `/news` | Daftar berita dan form penawaran | publik | P | Ada |
| `/news/[slug]` | Detail berita | publik | O | Belum |
| `/contact` | Kontak | publik | P | Ada |
| `/properti` | Katalog, filter, dan peta sinkron | publik | W | Belum |
| `/properti/[id]` | Detail properti, galeri, koordinat, favorit, pengajuan | publik | W | Belum |
| `/login`, `/register` | Masuk dan daftar pembeli | publik | W | Ada (login), Belum (register) |
| `/pasang-properti` | Pendaftaran agen | publik | W | Belum |
| `*` | Halaman 404 | semua | O | Belum |

Catatan: `/properti/[id]` boleh memakai `[slug]` agar URL lebih ramah. Bila dipakai, tambahkan kolom `slug` unik di `properties` (bagian 9.2).

### 6.2 Dashboard pembeli

| Rute | Halaman | Prioritas | Desain |
|---|---|---|---|
| `/pembeli` | Ringkasan | W | Belum |
| `/pembeli/favorit` | Favorit | W | Belum |
| `/pembeli/pengajuan` | Pengajuan dan status minat beli | W | Belum |
| `/pembeli/profil` | Profil | W | Belum |

### 6.3 Dashboard agen (sidebar yang sudah didesain)

| Menu sidebar | Rute | Isi | Prioritas | Desain |
|---|---|---|---|---|
| Dashboard | `/agen` | KPI, peringatan listing ditolak, pengajuan terbaru, komposisi listing, kunjungan terdekat | W | Ada |
| Properties | `/agen/properti` | Tabel listing, filter, ubah status, hapus | W | Ada |
| (+ Entri Unit Baru) | `/agen/properti/baru`, `/agen/properti/[id]/edit` | Form listing 4 section | W | Ada |
| Deals/Pipeline | `/agen/pipeline` | Papan dan daftar pengajuan, drawer tindak lanjut | W | Ada |
| Masterplan GIS | `/agen/masterplan` | Peta listing milik agen sinkron dengan daftar | W | Ada |
| Settings | `/agen/pengaturan` | Profil dan kata sandi | W | Ada |
| Leads | `/agen/leads` | Pengajuan baru yang perlu ditanggapi | O | Ada |
| Tasks | `/agen/tugas` | Tugas tindak lanjut | O | Ada |
| Contacts | `/agen/kontak` | Direktori calon pembeli | O | Ada |
| Messages | `/agen/pesan` | Percakapan dengan pembeli | O | Ada |
| Sales Analytics | `/agen/analitik` | KPI dan grafik penjualan | O | Ada |
| Agent Performance | `/agen/kinerja` | Kinerja milik agen sendiri | O | Ada |
| Conversion Funnel | `/agen/funnel` | Corong pengajuan | O | Ada |
| Integrations | `/agen/integrasi` | Status layanan terhubung (statis) | O | Ada |
| Help Center | `/agen/bantuan` | Panduan dan FAQ (statis) | O | Ada |

### 6.4 Dashboard admin

| Menu sidebar | Rute | Isi | Prioritas | Desain |
|---|---|---|---|---|
| Dashboard | `/admin` | KPI, antrean verifikasi, status listing, aktivitas terbaru | W | Ada |
| Listing Verification | `/admin/verifikasi` | Antrean, panel tinjauan, setujui atau tolak | W | Ada |
| Users | `/admin/pengguna` | Tabel pengguna, tambah, ubah peran, nonaktifkan, setujui agen | W | Ada |
| Categories | `/admin/kategori` | Tipe properti dan cluster | W | Ada |
| Data Moderation | `/admin/moderasi` | Antrean data bermasalah | W | Ada |
| Property Recap | `/admin/rekap` | Rekap dari database, ekspor CSV | W | Ada |
| Masterplan GIS | `/admin/masterplan` | Peta semua properti per status verifikasi | P | Ada |
| Settings | `/admin/pengaturan` | Profil dan kata sandi | W | Ada |

Kalau waktu terbatas, kerjakan semua baris berprioritas W lebih dulu (urutan ada di bagian 15).

---

## 7. Kebutuhan fungsional

Setiap kebutuhan punya ID agar mudah dirujuk di tugas, commit, dan pengujian.

### 7.1 Situs publik

**Header dan footer (semua halaman publik).** Header berisi logo "Sang Group", menu HOME, ABOUT, PRODUCTS, FACILITIES, LOCATION, NEWS, CONTACT, dan tombol "Pasang Properti". Toggle ID/EN dan "Ambience" di mockup hanya tampilan dan tidak masuk cakupan wajib. Footer mengikuti landing page.

**FR-PUB-01 Landing page.** Mengikuti desain landing: hero, penjelajahan properti per wilayah (Candisari, Tembalang, Sambiroto) yang menautkan ke `/properti?cluster=...`, ringkasan perumahan, dan ajakan kontak. Jumlah properti per wilayah dihitung dari database. Karena tugas menyebut peta persebaran, katalog, dan pencarian sebagai fitur halaman utama, landing wajib memuat section "Peta Persebaran" (pin properti terverifikasi dari database), katalog ringkas (6 properti terbaru), dan kolom pencarian cepat (lokasi, harga, tipe) yang membuka `/properti` dengan filter terisi. Urutan konten: hero, profil singkat Sang Group, nilai dan keunggulan, pengenalan tiga perumahan (kartu yang menautkan ke `/products/[slug]`), peta persebaran, katalog ringkas, dan ajakan kontak. Brand diperkenalkan lebih dulu sebelum pengunjung diarahkan ke perumahan.

**FR-PUB-02 Products `/products/[slug]`.** Satu halaman per perumahan, 6 section dengan data dari database:

1. Hero udara dengan overlay hijau, judul "Selamat Datang di [nama perumahan]". Data: `clusters`.
2. Ambience: panel teks di kiri dan foto gerbang di kanan, empat fitur keamanan (keamanan 24 jam, sistem RFID, gerbang otomatis, CCTV). Data: `facilities` (grup `ambience`).
3. Fasilitas 1: Taman (foto kecil, paragraf, foto besar). Data: `facilities`.
4. Fasilitas 2: Clubhouse dengan tiga label (Ruang Serbaguna, Playground Anak, Kolam Renang) di atas foto yang bertumpuk bingkai emas.
5. Spesifikasi (panel emas, label dan nilai per baris) dan Cluster Type (daftar tipe). Data: `cluster_specs` dan `property_types` yang dipakai di cluster itu. Klik tipe memuat denah tipe tersebut di section 6.
6. Denah dan galeri: mosaik 3 kolom, sel tengah menampilkan denah lantai 1 dan 2. Data: `property_photos` dengan `kind = 'floorplan'` dan `kind = 'photo'`.

**FR-PUB-03 Facilities.** Hero, blok zig-zag (foto dan kartu teks bertumpuk dengan garis emas vertikal), carousel Klub Olahraga, dan band ajakan. Data dari `facilities`.

**FR-PUB-04 Location.** Pengunjung memilih satu dari tiga perumahan lewat tiga blok pemilih (Sang Dipa aktif secara default).
- Mode "Peta": peta terang dengan pin tiga perumahan, pin aktif lebih besar dan peta memperbesar ke arah pin itu.
- Mode "Tampilan 360°": foto panorama perumahan aktif yang bisa diseret, kompas, dan label tempat sekitar.
- Panel detail hijau tua: nama, wilayah, satu paragraf, tabel fakta (akses ke tol, karakteristik lahan, legalitas, kisaran harga), tombol "Jadwalkan Survei" dan "Lihat Detail Perumahan".
- Kisaran harga dihitung dari properti terverifikasi pada cluster tersebut (`min(price)` sampai `max(price)`).
- Data: `clusters` (lat, lng, `panorama_path`, kolom fakta).

**FR-PUB-05 News.** Section "Berita Terbaru" (1 artikel utama dan 3 artikel kecil), section "Berita" (grid 3 kolom, 6 per halaman, filter Semua/Sang Dipa/Sang Wira/Sang Naya/Promo, pagination), dan band "Dapatkan Penawaran Eksklusif" dengan 4 kolom (Nama Lengkap, Email, Nomor WhatsApp, Kota). Form disimpan ke `contact_messages` dengan `kind = 'offer'`. Data berita dari `news_posts`.

**FR-PUB-06 Contact.** Hero dengan empat baris kontak, kartu form (Nama Lengkap, Nomor WhatsApp, Perumahan yang Diminati, Pesan), dan section Kantor Pemasaran. Form disimpan ke `contact_messages` dengan `kind = 'contact'`.

**FR-PUB-07 Katalog dan peta `/properti` (wajib, belum ada desain).**
- Hanya menampilkan listing `verification = 'verified'`.
- Filter: pencarian teks, cluster/lokasi, rentang harga, luas tanah, luas bangunan, tipe, ketersediaan.
- Daftar dan peta sinkron: filter mengubah keduanya, memilih item di daftar menyorot pin, klik pin menyorot item.
- Pin berasal dari kolom `lat` dan `lng` di database, diwarnai menurut ketersediaan.
- Pagination sisi server (12 item per halaman). Ada keadaan memuat dan kosong.
- Kartu listing menampilkan tanggal pembaruan terakhir ("Diperbarui 28 Okt 2026") dari `updated_at`.
- Bila pin banyak, pakai marker clustering. Di ponsel, tampilan dibagi menjadi tab "Daftar" dan "Peta".
- Saran desain: pakai pola halaman Masterplan GIS admin (peta besar dengan panel daftar melayang).

**FR-PUB-08 Detail properti `/properti/[id]` (wajib, belum ada desain).**
- Galeri foto (setiap foto punya teks alt), spesifikasi, harga, tag ketersediaan, tanggal pembaruan terakhir, mini peta dengan koordinat, denah bila ada.
- Tombol "Simpan ke Favorit" (hanya pembeli yang login; pengunjung diarahkan ke login).
- Form pengajuan: jenis (kunjungan atau minat beli), tanggal dan jam kunjungan (wajib untuk jenis kunjungan), pesan.
- Properti berstatus `booked` atau `sold` menampilkan label status dan form pengajuan dinonaktifkan.

**FR-PUB-09 Autentikasi.** `/login` memakai Supabase Auth. Pengunjung tanpa sesi yang membuka rute dashboard diarahkan ke `/login` dengan banner "Silakan masuk untuk mengakses dashboard". Tidak ada pemilih peran di form login. Setelah masuk, pengguna diarahkan ke dashboard sesuai perannya. Akun `pending` dan `inactive` menerima pesan penolakan yang jelas.

### 7.2 Dashboard pembeli (belum ada desain, spesifikasi minimal)

| ID | Kebutuhan |
|---|---|
| FR-BUY-01 | Ringkasan: jumlah favorit, pengajuan aktif, dan pengajuan terbaru |
| FR-BUY-02 | Favorit: daftar properti yang disimpan, tombol hapus dari favorit, tautan ke detail. Properti yang tidak lagi terverifikasi tampil dengan label "Tidak tersedia" |
| FR-BUY-03 | Pengajuan: tabel pengajuan milik sendiri (properti, jenis, tanggal, status), detail dengan timeline `inquiry_updates` (hanya baca), tombol "Batalkan" selama status `new` |
| FR-BUY-04 | Profil: nama, nomor WhatsApp, kata sandi. Email dan peran hanya baca |

### 7.3 Dashboard agen

**FR-AGT-01 Dashboard `/agen`.**
- Header "Halo, [nama]" dengan tanggal, tombol "Tambah Listing Baru" dan "Ekspor Rekap".
- Peringatan satu baris bila ada listing ditolak, memuat alasan dan tautan "Perbaiki sekarang".
- Empat kartu KPI: Total Listing, Menunggu Verifikasi, Pengajuan Aktif, Properti Terjual.
- Kartu "Pengajuan Masuk Terbaru" (5 baris), kartu "Komposisi Listing" (bar bertumpuk dan total nilai listing aktif), kartu hijau "Kunjungan Terdekat" dengan tombol "Hubungi Pembeli" dan "Lihat di Peta".
- Definisi angka ada di bagian 8.5.

**FR-AGT-02 Properties `/agen/properti`.**
- Tabel: foto, nama, lokasi, harga, ketersediaan, verifikasi, jumlah pengajuan, aksi.
- Filter: pencarian, ketersediaan, verifikasi, tipe, dan "hanya yang ada pengajuan aktif". Pagination.
- Listing ditolak menampilkan alasan admin di bawah nama.
- Aksi: Edit, Ubah Status (tersedia, dipesan, terjual), Hapus (hanya listing `draft` atau `rejected`, dengan dialog konfirmasi).
- Kolom pengajuan membuka pipeline yang terfilter pada properti itu.

**FR-AGT-03 Form listing `/agen/properti/baru` dan `/[id]/edit`.**
- Empat section: Informasi Dasar, Spesifikasi dan Harga, Lokasi, Foto Properti.
- Lokasi: alamat dan pemilih titik di peta. Klik peta mengisi `lat` dan `lng`; kedua field juga bisa diketik.
- Foto: unggah ke object storage, thumbnail dengan penanda "Foto utama", status unggah (progres dan galat per berkas).
- Footer lengket: "Simpan sebagai Draft" dan "Kirim untuk Verifikasi". Tombol kirim mengubah status ke `pending`.
- Validasi ada di bagian 8.4.

**FR-AGT-04 Deals/Pipeline `/agen/pipeline`.**
- Tampilan "Papan" (kolom Baru, Konsultasi, Dijadwalkan, Selesai Kunjungan, Negosiasi, Deal, dan kolom Batal yang bisa dilipat) dan tampilan "Daftar".
- Kartu dapat dipindah antar kolom. Memindahkan ke Deal meminta pilihan status properti (Dipesan atau Terjual). Memindahkan ke Batal meminta alasan.
- Klik kartu membuka drawer: data pembeli (tautan `wa.me`), properti, pesan, indikator tahap, form tindak lanjut (status, jadwal kunjungan, catatan), dan timeline pembaruan.
- Setiap perubahan menulis satu baris `inquiry_updates`.

**FR-AGT-05 Masterplan GIS `/agen/masterplan`.** Peta listing milik agen dengan pin diwarnai menurut ketersediaan, cincin biru untuk listing yang punya pengajuan aktif, popup ringkas, dan daftar hasil yang sinkron dengan peta.

**FR-AGT-06 Settings `/agen/pengaturan`.** Data diri (nama, nomor WhatsApp, nama agensi, foto profil) dan ubah kata sandi. Peran hanya baca dengan keterangan "Peran hanya dapat diubah oleh admin".

**Halaman opsional agen (O).** Semuanya dihitung dari tabel `inquiries` dan `properties` milik agen sendiri, kecuali yang tercatat.

| ID | Halaman | Sumber data |
|---|---|---|
| FR-AGT-07 | Leads | `inquiries` berstatus `new` dan `consultation`. Aksi "Tanggapi" memindahkan ke `consultation` |
| FR-AGT-08 | Tasks | Tabel tambahan `tasks` |
| FR-AGT-09 | Contacts | Pembeli yang pernah mengajukan ke agen, dengan riwayat pengajuan |
| FR-AGT-10 | Messages | Tabel tambahan `messages`. Bila tidak dikerjakan, ganti dengan tautan `wa.me` |
| FR-AGT-11 | Sales Analytics | Agregasi pengajuan per bulan dan per cluster |
| FR-AGT-12 | Agent Performance | Hanya data agen sendiri, tanpa peringkat agen lain |
| FR-AGT-13 | Conversion Funnel | Jumlah pengajuan yang mencapai tiap tahap pipeline |
| FR-AGT-14 | Integrations dan Help Center | Konten statis |

### 7.4 Dashboard admin

**FR-ADM-01 Dashboard `/admin`.**
- Peringatan satu baris untuk antrean verifikasi.
- Empat KPI: Total Properti, Menunggu Verifikasi, Total Pengguna, Total Pengajuan.
- Kartu "Antrean Verifikasi" (3 baris dengan tombol "Tinjau"), kartu "Status Listing" (bar bertumpuk), dan kartu "Aktivitas Terbaru" (timeline dari `audit_log`).

**FR-ADM-02 Listing Verification `/admin/verifikasi`.**
- Layout dua kolom: antrean di kiri (tab Menunggu, Terverifikasi, Ditolak, Semua; pencarian) dan panel tinjauan di kanan.
- Panel tinjauan: header (nama, agen, tanggal kirim, status), galeri foto, tabel spesifikasi, mini peta dengan koordinat, empat kotak pemeriksaan (data lengkap, foto sesuai dan jelas, koordinat sesuai alamat dan sertifikat, harga wajar), kolom "Catatan untuk agen".
- Tombol "Setujui & Tayangkan" memunculkan dialog konfirmasi, lalu status menjadi `verified` dan listing tampil di katalog dan peta. Toast: "Listing berhasil ditayangkan".
- Tombol "Tolak Listing" mewajibkan alasan. Status menjadi `rejected` dan alasan tampil di dashboard agen.
- Listing yang sudah diputuskan menampilkan keputusan, nama admin, tanggal, dan catatan dalam blok baca saja.

**FR-ADM-03 Users `/admin/pengguna`.**
- Tabel: nama, email, peran, status, tanggal bergabung, aksi. Filter peran dan status, pencarian, pagination.
- Drawer "Tambah/Edit Pengguna": nama, email, WhatsApp, peran, kata sandi sementara (saat menambah), status.
- Dialog konfirmasi untuk "Ubah peran" dan "Nonaktifkan".
- Akun agen berstatus `pending` menampilkan tombol "Setujui" yang mengubah status menjadi `active`.
- Admin tidak dapat menonaktifkan atau menurunkan peran akunnya sendiri.

**FR-ADM-04 Categories `/admin/kategori`.**
- Dua tab: Tipe Properti (tabel `property_types`) dan Cluster (tabel `clusters`).
- Kolom: kode, nama, deskripsi, jumlah listing, aksi.
- Modal tambah dan edit dengan validasi "Kode sudah digunakan" dan "Nama wajib diisi".
- Tombol Hapus nonaktif bila kategori masih dipakai listing, dengan keterangan jumlah listing yang memakainya.

**FR-ADM-05 Data Moderation `/admin/moderasi`.**
- Tab Listing, Pengajuan, Pengguna dengan filter status moderasi (Perlu Ditinjau, Ditindak, Diabaikan).
- Sumber laporan: sistem (koordinat ganda, harga tidak wajar, foto kosong, pengiriman pengajuan ganda) dan pembeli (laporan listing).
- Drawer tinjauan: detail item, kolom catatan wajib, tindakan "Sembunyikan dari Katalog" (listing berstatus tersembunyi dan hilang dari katalog dan peta), "Hapus Data" (dengan konfirmasi), dan "Abaikan".
- Lencana di sidebar menampilkan jumlah laporan berstatus Perlu Ditinjau.

**FR-ADM-06 Property Recap `/admin/rekap`.**
- Filter: periode, cluster, kategori, agen, status.
- Lima KPI (Total Properti, Tersedia, Dipesan, Terjual, Total Nilai Listing), grafik properti per cluster dan per kategori, tabel rekap per agen dengan baris total, dan tabel daftar properti dengan pagination.
- Tombol "Ekspor CSV" mengunduh hasil yang sedang difilter. Tombol "Cetak" memakai tampilan cetak browser.
- Kartu tambahan "Rekap Pengajuan": jumlah pengajuan per status, per jenis (kunjungan atau minat beli), dan per agen. Bagian ini belum ada di desain.
- Semua angka dihitung dari database.

**FR-ADM-07 Masterplan GIS `/admin/masterplan`.** Peta semua properti non-draft dengan pin berbentuk label harga, diwarnai menurut status verifikasi. Panel melayang di kanan punya dua keadaan: daftar (dengan dropdown urutan) dan detail properti terpilih (foto, harga, tag, fakta, agen, tombol "Tinjau Listing"). Filter: pencarian, cluster, kategori, ketersediaan, verifikasi.

**FR-ADM-08 Settings `/admin/pengaturan`.** Dua tab. Profil: foto, nama, WhatsApp; email dan peran hanya baca. Keamanan: ubah kata sandi dengan validasi konfirmasi.

### 7.5 Alur pengguna utama

**Menemukan rumah.** Buka beranda → mengenal Sang Group → pilih Sang Dipa, Sang Wira, atau Sang Naya, atau buka katalog → pakai filter → lihat pin di peta → buka detail properti.

**Mengajukan kunjungan atau minat beli.** Buka detail properti → masuk atau daftar bila belum → isi form pengajuan → sistem memvalidasi dan menyimpan → agen meninjau dan memperbarui tindak lanjut → pembeli melihat status.

**Publikasi listing.** Agen masuk → membuat listing dan mengunggah foto → mengisi koordinat dan spesifikasi → mengirim untuk verifikasi → admin meninjau → bila disetujui listing tampil di katalog dan peta, bila ditolak agen menerima catatan perbaikan.

**Mengelola status unit.** Agen memperbarui tersedia, dipesan, atau terjual → sistem menyimpan → katalog, detail, peta, dan dashboard menampilkan status terbaru.

Skenario uji teknis dari alur ini ada di bagian 13.1.

---

## 8. Aturan bisnis

### 8.1 Siklus listing

```
draft ──kirim──> pending ──setujui (admin)──> verified
  ^                 │
  │                 └──tolak (admin, alasan wajib)──> rejected
  └──────────────── perbaiki dan kirim ulang ─────────────┘
```

- Hanya admin yang dapat mengubah status ke `verified` atau `rejected`.
- Agen yang mengubah `lat`, `lng`, alamat, harga, atau foto pada listing `verified` membuat status kembali ke `pending`. Perubahan ketersediaan tidak mengubah status verifikasi.
- Listing `verified` yang disembunyikan lewat moderasi tidak tampil di katalog dan peta, tetapi tetap terlihat oleh pemiliknya dan admin.
- Admin tidak melihat listing `draft`.

### 8.2 Ketersediaan

- Nilai: `available` → `booked` → `sold`. Agen dapat mengubahnya langsung (Ubah Status) atau lewat tahap Deal di pipeline.
- Hanya properti `verified` dan `available` yang menerima pengajuan baru.
- Mengubah ke `sold` tidak dapat dibatalkan oleh agen. Koreksi dilakukan admin.

### 8.3 Pipeline pengajuan

```
new → consultation → scheduled → visit_done → negotiation → deal
 └──────────────── (tahap mana pun sebelum deal) ──────────────> cancelled
```

- Agen boleh melompati tahap (misalnya `new` langsung ke `scheduled`).
- `deal` mewajibkan pilihan status properti (`booked` atau `sold`) dalam satu transaksi database yang sama.
- `cancelled` mewajibkan alasan minimal 10 karakter.
- `scheduled` mewajibkan tanggal dan jam kunjungan.
- Pembeli hanya dapat membatalkan pengajuan sendiri selama status `new`.
- Satu pembeli hanya boleh punya satu pengajuan aktif per properti (indeks unik parsial pada `buyer_id, property_id` untuk status selain `deal` dan `cancelled`).

### 8.4 Validasi

Semua validasi dijalankan di klien (pesan cepat), Server Action (Zod), dan database (constraint `CHECK`, `NOT NULL`, `UNIQUE`).

| Data | Aturan | Pesan galat |
|---|---|---|
| Nama properti | wajib, 5 sampai 120 karakter | "Nama properti wajib diisi (5 sampai 120 karakter)" |
| Harga | bilangan bulat lebih dari 0 | "Harga tidak boleh negatif atau nol" |
| Luas tanah dan bangunan | angka lebih dari 0 | "Luas harus lebih dari 0" |
| Kamar tidur, kamar mandi | bilangan bulat 0 sampai 20 | "Jumlah tidak valid" |
| Lantai | bilangan bulat 1 sampai 5 | "Jumlah lantai tidak valid" |
| Latitude | -90 sampai 90, wajib saat dikirim untuk verifikasi | "Latitude harus di antara -90 dan 90" |
| Longitude | -180 sampai 180, wajib saat dikirim untuk verifikasi | "Longitude harus di antara -180 dan 180" |
| Foto | JPG, PNG, atau WebP; maksimal 2 MB; 1 sampai 8 per listing; satu foto utama | "Ukuran berkas melebihi 2 MB" / "Format berkas tidak didukung" |
| Tanggal kunjungan | tidak boleh sebelum hari ini (WIB) | "Tanggal kunjungan tidak valid" |
| Pesan pengajuan | maksimal 500 karakter | "Pesan terlalu panjang" |
| Nomor WhatsApp | format Indonesia (08xx atau +62xx), 9 sampai 14 digit | "Nomor WhatsApp tidak valid" |
| Email | format email, unik | "Email sudah terdaftar" |
| Kata sandi | minimal 8 karakter, huruf dan angka | "Minimal 8 karakter, kombinasi huruf dan angka" |
| Kode kategori | huruf besar dan angka, 2 sampai 10 karakter, unik per tabel | "Kode sudah digunakan" |
| Alasan tolak dan batal | minimal 10 karakter | "Alasan wajib diisi" |

Pengiriman ganda dicegah dengan tombol nonaktif saat proses berjalan dan dengan constraint unik di database.

### 8.5 Definisi angka dashboard

Semua angka dihitung dari database sesuai hak akses pengguna, lewat view atau RPC yang tunduk pada RLS.

**Agen**

| Angka | Definisi |
|---|---|
| Total Listing | jumlah `properties` milik agen (semua status verifikasi, termasuk draft) |
| Menunggu Verifikasi | `verification = 'pending'` |
| Pengajuan Aktif | `inquiries` milik agen dengan status selain `deal` dan `cancelled` (termasuk `new`) |
| Properti Terjual | `availability = 'sold'`; nilai = jumlah `price` |
| Komposisi Listing | jumlah per `availability` |
| Total nilai listing aktif | jumlah `price` untuk `availability` selain `sold` |
| Kunjungan Terdekat | `scheduled_at` terkecil yang belum lewat, status `scheduled` |

Catatan: tab "Aktif" di halaman pipeline hanya memuat `consultation`, `scheduled`, `visit_done`, dan `negotiation` karena `new` punya tab sendiri. Angka KPI "Pengajuan Aktif" dan kolom "Pengajuan" di tabel listing tetap memakai definisi di atas (termasuk `new`).

**Admin**

| Angka | Definisi |
|---|---|
| Total Properti | `properties` dengan `verification` selain `draft` |
| Menunggu Verifikasi | `verification = 'pending'`; "terlama" = selisih sekarang dengan `submitted_at` paling awal |
| Total Pengguna | jumlah `profiles`, dipecah per peran |
| Total Pengajuan | jumlah `inquiries`; "deal bulan ini" = status `deal` dengan pembaruan di bulan berjalan |
| Status Listing | jumlah per `verification`, tanpa draft |
| Total Nilai Listing (rekap) | jumlah `price` untuk semua properti non-draft |
| Lencana Data Moderation | jumlah `moderation_reports` berstatus `pending` |
| Lencana Listing Verification | jumlah listing `pending` |

---

## 9. Model data

PostgreSQL (dapat menggunakan Supabase sebagai penyedia database, tetapi aplikasi wajib mengaksesnya melalui backend sendiri dengan Prisma/Drizzle/pg; bukan PostgREST). Entitas yang punya anak dipisah menjadi tabel sendiri. Kolom `id` bertipe `uuid` (default `gen_random_uuid()`), kecuali `profiles.id` yang sama dengan `auth.users.id`. Semua tabel punya `created_at`.

### 9.1 Enum

| Enum | Nilai |
|---|---|
| `user_role` | `buyer`, `agent`, `admin` |
| `user_status` | `pending`, `active`, `inactive` |
| `verification_status` | `draft`, `pending`, `verified`, `rejected` |
| `availability_status` | `available`, `booked`, `sold` |
| `inquiry_type` | `visit`, `purchase_interest` |
| `inquiry_status` | `new`, `consultation`, `scheduled`, `visit_done`, `negotiation`, `deal`, `cancelled` |
| `photo_kind` | `photo`, `floorplan` |
| `message_kind` | `contact`, `offer` |
| `report_target` | `property`, `inquiry`, `user` |
| `report_source` | `system`, `buyer` |
| `report_status` | `pending`, `actioned`, `ignored` |

### 9.2 Tabel

**Inti (wajib)**

| Tabel | Kolom utama | Relasi |
|---|---|---|
| `profiles` | `id`, `full_name`, `email`, `phone`, `role`, `status`, `agency_name`, `avatar_path` | `id` → `auth.users` |
| `clusters` | `code` (unik), `name`, `slug` (unik), `area`, `address`, `description`, `cover_path`, `contact_phone`, `contact_email`, `lat`, `lng`, `panorama_path`, `access_note`, `land_character`, `legality`, `sort_order`, `is_active`, `is_demo` | |
| `property_types` | `code` (unik), `name`, `description` | |
| `properties` | `owner_id`, `cluster_id`, `type_id`, `title`, `slug` (unik, opsional), `is_demo`, `description`, `address`, `lat`, `lng`, `price`, `land_area`, `building_area`, `bedrooms`, `bathrooms`, `floors`, `certificate`, `availability`, `verification`, `rejection_reason`, `is_hidden`, `submitted_at`, `verified_by`, `verified_at`, `updated_at` | `owner_id` → `profiles`; `cluster_id` → `clusters`; `type_id` → `property_types` |
| `property_photos` | `property_id`, `storage_path`, `alt_text`, `kind`, `is_cover`, `sort_order` | `property_id` → `properties` (cascade) |
| `favorites` | `buyer_id`, `property_id` | unik pada pasangan keduanya |
| `inquiries` | `property_id`, `buyer_id`, `agent_id`, `type`, `status`, `message`, `preferred_visit_at`, `scheduled_at`, `cancel_reason`, `updated_at` | `agent_id` disalin dari `properties.owner_id` saat insert |
| `inquiry_updates` | `inquiry_id`, `status`, `note`, `scheduled_at`, `created_by` | `inquiry_id` → `inquiries` (cascade) |
| `moderation_reports` | `target_type`, `target_id`, `reason_type`, `reason_detail`, `source`, `reported_by`, `status`, `admin_note`, `handled_by`, `handled_at` | |
| `audit_log` | `actor_id`, `action`, `entity`, `entity_id`, `detail` | Sumber "Aktivitas Terbaru" di dashboard admin |

**Konten situs publik**

| Tabel | Kolom utama |
|---|---|
| `cluster_specs` | `cluster_id`, `label`, `value`, `sort_order` (baris spesifikasi di Products) |
| `facilities` | `cluster_id` (boleh kosong), `group` (`ambience`, `taman`, `clubhouse`, `sekitar`, `olahraga`), `title`, `description`, `photo_path`, `sort_order` |
| `news_posts` | `slug` (unik), `title`, `excerpt`, `content`, `cover_path`, `category`, `is_featured`, `published_at` |
| `contact_messages` | `kind`, `full_name`, `email`, `phone`, `city`, `cluster_interest`, `message`, `is_handled` |

**Opsional (hanya bila halaman agen opsional dikerjakan)**

| Tabel | Kolom utama |
|---|---|
| `tasks` | `agent_id`, `inquiry_id` (boleh kosong), `title`, `type`, `due_at`, `is_done` |
| `messages` | `inquiry_id`, `sender_id`, `body`, `read_at` |

### 9.3 Indeks dan constraint penting

- `properties`: indeks pada `(verification, availability)`, `cluster_id`, `owner_id`; `CHECK (price > 0)`, `CHECK (lat BETWEEN -90 AND 90)`, `CHECK (lng BETWEEN -180 AND 180)`.
- `inquiries`: indeks pada `(agent_id, status)` dan `buyer_id`; indeks unik parsial pada `(buyer_id, property_id)` untuk `status NOT IN ('deal','cancelled')`.
- `favorites`: `UNIQUE (buyer_id, property_id)`.
- `clusters.code` dan `property_types.code` unik. Kunci asing kategori memakai `ON DELETE RESTRICT` agar kategori yang dipakai tidak bisa dihapus.
- `property_photos`: paling banyak satu `is_cover = true` per properti.

### 9.4 Trigger dan fungsi

| Nama | Fungsi |
|---|---|
| `handle_new_user` | Membuat baris `profiles` saat pendaftaran. Peran dari metadata hanya boleh `buyer` atau `agent`; `agent` menghasilkan `status = 'pending'`. Nilai lain menjadi `buyer` |
| `protect_profile_columns` | Pengguna non-admin tidak dapat mengubah `role` dan `status` |
| `protect_property_columns` | Non-admin tidak dapat mengubah `verification` menjadi `verified` atau `rejected`. Perubahan `lat`, `lng`, alamat, harga, atau foto pada listing `verified` mengembalikan `verification` ke `pending` |
| RPC `submit_for_verification(property_id)` | Memeriksa kelengkapan (koordinat, minimal 1 foto) lalu mengubah ke `pending` dan mengisi `submitted_at` |
| RPC `approve_property(id, note)` dan `reject_property(id, reason)` | Hanya admin. Menulis `audit_log` |
| RPC `update_inquiry_status(id, status, note, scheduled_at)` | Hanya agen pemilik. Menulis `inquiry_updates` |
| RPC `close_deal(inquiry_id, availability)` | Mengubah pengajuan ke `deal` dan properti ke `booked` atau `sold` dalam satu transaksi |
| View atau RPC statistik | `agent_stats()`, `admin_stats()`, `admin_recap(filter)`, `funnel_stats()`. Dibuat `security invoker` agar RLS tetap berlaku |

---

## 10. Keamanan, file, dan notifikasi

### 10.1 Autentikasi dan otorisasi server

- Autentikasi menggunakan Supabase Auth atau mekanisme setara; backend wajib memverifikasi sesi/token pada setiap request terlindungi.
- Role, status akun, harga, status listing, `owner_id`, `buyer_id`, dan identitas aktor tidak boleh dipercaya jika dikirim dari client. Ambil identitas dari sesi terverifikasi dan data server/database.
- Pemeriksaan role dan ownership dilakukan pada Route Handler/Server Action; UI/middleware hanya lapisan tambahan.
- Semua query menggunakan Prisma/Drizzle/`pg` dari server dan query terparameterisasi. Dilarang menjadikan PostgREST sebagai backend data bisnis.
- Terapkan rate limiting pada login, registrasi, formulir kontak, pembuatan pengajuan, upload, dan endpoint subscription/push.
- Password yang dikelola sendiri harus di-hash menggunakan algoritma yang sesuai. Jika memakai Supabase Auth, jangan menyimpan password mentah atau hash password sendiri tanpa kebutuhan.
- Error response publik tidak boleh membocorkan stack trace, query, secret, atau informasi internal.

### 10.2 Kebijakan database

PostgreSQL adalah sumber data persisten. Tabel bisnis diakses melalui backend aplikasi. RLS dapat dipakai sebagai defense-in-depth bila host database mendukung dan konfigurasi koneksi sesuai, tetapi RLS tidak menggantikan pemeriksaan otorisasi pada backend. Migration files wajib disediakan dan dapat membangun ulang database dari kondisi kosong.

### 10.3 Object storage

| Bucket/container | Isi | Aturan |
|---|---|---|
| `property-photos` | foto properti dan denah | Foto publik hanya boleh diakses jika listing boleh tampil; unggah dibatasi pemilik listing/admin |
| `avatars` | foto profil | Atur akses sesuai kebutuhan; jangan simpan dokumen identitas |
| `news-covers` | sampul berita | Baca publik; tulis admin |
| `panoramas` | foto panorama 360° | Baca publik bila terkait cluster aktif; tulis admin |
| `private-uploads` (bila dibutuhkan) | berkas privat | Tidak ada akses publik; unduh melalui backend atau signed URL berumur pendek |

- Berkas disimpan di object storage (S3-compatible, R2, S3, MinIO atau setara), bukan sebagai Base64 di PostgreSQL.
- PostgreSQL menyimpan object key/path, MIME type, ukuran, uploader, relasi, dan waktu unggah.
- Validasi ukuran, tipe MIME dan ekstensi, serta hak akses dilakukan di server. Jangan hanya mempercayai `Content-Type` dari browser.
- Kredensial storage hanya berada di server. Signed URL dibuat backend dan memiliki masa berlaku terbatas bila akses privat diperlukan.
- Batas gambar mengikuti aturan produk: foto properti JPG/PNG/WebP maksimal 2 MB, 1–8 foto per listing dan satu foto utama; panorama maksimal 8 MB.

### 10.4 Row Level Security dan privasi

Kebijakan akses data harus mempertahankan matriks hak akses pada bagian 3. RLS boleh diterapkan sebagai lapisan tambahan, tetapi semua pembacaan/mutasi data privat harus tetap diperiksa oleh backend. Data email dan WhatsApp pembeli hanya boleh diakses agen pemilik listing terkait dan admin sesuai kebutuhan. `audit_log` tidak boleh dapat diubah oleh pengguna biasa.

### 10.5 Web Push dan background worker (wajib)

Web Push nyata menjadi kebutuhan MVP untuk notifikasi kejadian bisnis yang relevan, misalnya:
- agen menerima notifikasi saat pembeli membuat pengajuan baru pada listing miliknya;
- pembeli menerima notifikasi saat status pengajuannya berubah;
- agen menerima notifikasi saat admin menyetujui atau menolak listing miliknya.

Alur wajib: transaksi bisnis berhasil disimpan → enqueue job persisten → worker memproses job → Web Push dikirim dengan VAPID → Service Worker menampilkan notifikasi → klik notifikasi membuka halaman relevan.

Persyaratan:
- Minta izin notifikasi hanya setelah interaksi pengguna, melalui tombol yang jelas di pengaturan dashboard.
- Service Worker menangani event `push` dan `notificationclick`; klik membuka rute relevan setelah validasi tujuan.
- Simpan subscription pada PostgreSQL dan hubungkan ke pengguna/identitas yang sesuai.
- Sediakan endpoint terautentikasi untuk membuat/menghapus subscription.
- VAPID private key hanya tersedia di server/worker; public key dapat dikirim ke browser.
- Gunakan antrean persisten (BullMQ + Redis atau setara) dan proses worker terpisah.
- Implementasikan retry terbatas, backoff, pencatatan kegagalan, deduplikasi/idempotency key, dan penghapusan subscription yang sudah tidak valid (mis. respons 404/410).
- Kegagalan push tidak boleh membatalkan atau menggagalkan penyimpanan pengajuan/perubahan status.
- Worker harus bisa dijalankan secara terpisah dan memiliki dokumentasi operasional.
- Tangani browser yang tidak mendukung push, izin ditolak, subscription kedaluwarsa, serta kegagalan queue.

### 10.6 Logging dan observability

- Gunakan Pino/Winston atau logger terstruktur setara untuk backend dan worker.
- Catat request/job ID, jenis kejadian, durasi, status berhasil/gagal, jumlah percobaan, dan konteks yang tidak sensitif.
- Jangan mencatat password, token, VAPID private key, kredensial database/storage, atau isi pesan pribadi yang tidak diperlukan.
- Error penting dicatat dan dapat ditemukan; gunakan Sentry atau monitoring setara bila tersedia.
- Sediakan cara melihat job gagal dan menjalankan retry terkontrol.

## 11. Data dummy

Semua identitas fiktif. Seed dijalankan melalui script yang terdokumentasi (mis. `prisma/seed.js`) menggunakan koneksi PostgreSQL server-side. Jangan gunakan `service_role` untuk query bisnis atau menaruh secret di repository.

### 11.1 Akun uji

Satu kata sandi uji untuk semua akun: `Uji12345!`. Catat di README, jangan di kode, dan ganti sebelum pemakaian nyata.

| Peran | Nama | Email | Status |
|---|---|---|---|
| Admin | Keyvan Akath | admin.keyvan@contoh.id | aktif |
| Agen | Budi Santoso | agen.budi@contoh.id | aktif |
| Agen | Siti Rahmawati | agen.siti@contoh.id | aktif |
| Agen | Andi Wijaya | agen.andi@contoh.id | aktif |
| Pembeli | Rina Pratiwi | rina@contoh.id | aktif |
| Pembeli | Ahmad Fauzi | ahmad@contoh.id | aktif |
| Pembeli | Dewi Lestari | dewi@contoh.id | aktif |
| Pembeli | Bagas Setiawan | bagas@contoh.id | aktif |
| Pembeli | Sari Wulandari | sari@contoh.id | aktif |
| Pembeli | Hendra Kusuma | hendra@contoh.id | nonaktif |
| Pembeli | Maya Kusuma | maya@contoh.id | aktif |
| Pembeli | Fajar Nugroho | fajar@contoh.id | aktif |

Tambahkan satu akun agen berstatus `pending` (misalnya `agen.baru@contoh.id`) untuk menguji persetujuan agen.

### 11.2 Cluster dan kategori

| Cluster | Wilayah | Koordinat contoh |
|---|---|---|
| Sang Dipa | Candisari | -7.0089, 110.4172 |
| Sang Wira | Tembalang | -7.0508, 110.4403 |
| Sang Naya | Sambiroto | -7.0562, 110.4758 |

| Kode | Tipe properti | Luas bangunan / tanah | Kamar tidur / mandi / lantai |
|---|---|---|---|
| T36 | Tipe 36/72 | 36 / 72 m² | 2 / 1 / 1 |
| T45 | Tipe 45/84 | 45 / 84 m² | 2 / 1 / 1 |
| T60 | Tipe 60/96 | 60 / 96 m² | 3 / 2 / 2 |
| T72 | Tipe 72/120 | 72 / 120 m² | 3 / 2 / 2 |

Koordinat adalah perkiraan. Ganti dengan titik lokasi sebenarnya sebelum demo.

### 11.3 Properti (9, foto dan koordinat berbeda)

| # | Properti | Agen | Harga | Ketersediaan | Verifikasi | Koordinat contoh |
|---|---|---|---|---|---|---|
| 1 | Sang Dipa Tipe 36/72 | Budi | Rp 485.000.000 | Tersedia | Terverifikasi | -7.0072, 110.4168 |
| 2 | Sang Dipa Tipe 45/84 | Budi | Rp 625.000.000 | Dipesan | Terverifikasi | -7.0089, 110.4185 |
| 3 | Sang Wira Tipe 60/96 | Budi | Rp 890.000.000 | Tersedia | Terverifikasi | -7.0508, 110.4403 |
| 4 | Sang Naya Tipe 36/72 | Budi | Rp 410.000.000 | Terjual | Terverifikasi | -7.0562, 110.4758 |
| 5 | Sang Naya Tipe 72/120 | Budi | Rp 1.250.000.000 | Tersedia | Menunggu (masuk 26 Okt) | -7.0579, 110.4775 |
| 6 | Sang Wira Tipe 45/84 | Budi | Rp 720.000.000 | Tersedia | Ditolak ("Koordinat lokasi tidak sesuai dengan sertifikat tanah") | -7.0525, 110.4421 |
| 7 | Sang Naya Tipe 45/84 | Siti | Rp 560.000.000 | Tersedia | Terverifikasi | -7.0545, 110.4741 |
| 8 | Sang Wira Tipe 36/72 | Siti | Rp 455.000.000 | Tersedia | Menunggu (masuk 27 Okt) | -7.0490, 110.4380 |
| 9 | Sang Dipa Tipe 60/96 | Andi | Rp 780.000.000 | Tersedia | Menunggu (masuk 28 Okt) | -7.0110, 110.4152 |

Tiap properti punya minimal 3 foto (satu sebagai foto utama) dan satu denah. Sertifikat: SHM. Total nilai non-draft: Rp 6.175.000.000. Ringkasan: 5 terverifikasi, 3 menunggu, 1 ditolak; 7 tersedia, 1 dipesan, 1 terjual.

### 11.4 Pengajuan (8) dan riwayatnya

| # | Pembeli | Properti | Jenis | Status | Tanggal dibuat | Catatan |
|---|---|---|---|---|---|---|
| 1 | Rina Pratiwi | 1 | Kunjungan | Baru | 29 Okt 2026, 09.30 | ingin kunjungan 3 Nov, 10.00 |
| 2 | Ahmad Fauzi | 1 | Minat Beli | Konsultasi | 28 Okt 2026, 14.15 | |
| 3 | Dewi Lestari | 3 | Kunjungan | Dijadwalkan | 26 Okt 2026 | kunjungan Jumat, 30 Okt 2026, 10.00 |
| 4 | Bagas Setiawan | 2 | Minat Beli | Deal | 22 Okt 2026 | properti menjadi Dipesan |
| 5 | Sari Wulandari | 4 | Minat Beli | Deal | 18 Okt 2026 | properti menjadi Terjual |
| 6 | Hendra Kusuma | 3 | Kunjungan | Batal | 20 Okt 2026 | alasan: "Pembeli menunda rencana" |
| 7 | Maya Kusuma | 7 | Kunjungan | Dijadwalkan | 25 Okt 2026 | kunjungan Sabtu, 31 Okt 2026, 11.00 |
| 8 | Fajar Nugroho | 7 | Minat Beli | Konsultasi | 27 Okt 2026 | |

Setiap pengajuan selain `new` punya minimal satu baris `inquiry_updates`. Hasil perhitungan yang harus cocok: agen Budi memiliki 3 pengajuan aktif (Rina, Ahmad, Dewi), properti 1 menampilkan "2 aktif", properti 3 menampilkan "1 aktif".

### 11.5 Konten lain

- **Favorit:** minimal 5 baris (pembeli berbeda, properti berbeda).
- **Moderasi (5 laporan):** Sang Wira Tipe 60/96, koordinat ganda (sistem, perlu ditinjau); Sang Naya Tipe 45/84, foto tidak sesuai (pembeli, perlu ditinjau); pengajuan Ahmad Fauzi, pengiriman ganda 3 kali dalam 1 jam (sistem, perlu ditinjau); akun Andi Wijaya, listing berulang ditolak (sistem, perlu ditinjau); satu laporan lama berstatus diabaikan. Hasilnya lencana sidebar menunjukkan 4.
- **Berita (6):** misalnya "Peresmian Clubhouse Sang Dipa", "Promo Akhir Tahun Sang Naya", "Jalur Jogging Baru di Sang Wira", "Tips Mengajukan KPR untuk Rumah Pertama", "Sang Wira Tahap 2 Dibuka", "Kunjungan Lokasi Akhir Pekan". Satu artikel bertanda utama, kategori bervariasi.
- **Fasilitas:** gerbang utama (keamanan 24 jam, RFID, gerbang otomatis, CCTV), taman, clubhouse (ruang serbaguna, playground anak, kolam renang), klub olahraga (tenis, basket, kolam renang, gym), serta fasilitas sekitar.
- **Spesifikasi cluster:** isi placeholder sesuai baris di desain (pondasi, struktur, rangka atap, penutup atap, plafon, dinding, lantai utama, sanitair, kusen dan jendela, daun pintu, cat exterior, cat interior, daya listrik, air bersih). Ganti dengan data asli.
- **Audit log:** minimal 6 entri untuk timeline "Aktivitas Terbaru".

### 11.6 Data resmi dan data simulasi

- Harga, stok, luas kawasan, tipe resmi, koordinat unit, kontak, site plan, fasilitas, dan legalitas belum dianggap final sampai dikonfirmasi Sang Group.
- Data dari seed ditandai `is_demo = true` pada `properties` dan `clusters`. Antarmuka menampilkan label "Data simulasi" pada kartu dan detail listing demo, serta catatan kecil di footer situs publik.
- Data dummy tidak disajikan sebagai stok penjualan nyata. Label dilepas setelah data dikonfirmasi dan `is_demo` diubah menjadi `false`.
- Kontak resmi di footer dan halaman Contact (`contact_phone`, `contact_email`) diisi setelah dikonfirmasi. Sebelum itu pakai kontak contoh yang jelas fiktif.

---

## 12. Kebutuhan non-fungsional

| Aspek | Ketentuan |
|---|---|
| Responsif dan aksesibilitas | Desktop/tablet/ponsel; fokus keyboard terlihat, label form, alt text, kontras memadai, semua kontrol inti dapat dipakai dengan keyboard |
| Umpan balik | Semua daftar/form memiliki loading, empty, success, dan error state |
| Pagination dan filter | Pagination server-side pada katalog dan tabel; query efisien dengan indeks yang sesuai |
| Performa | Hindari N+1 query, data berlebihan, dan query berulang; gunakan pagination, caching secara sadar, `next/image`, lazy loading, peta dinamis, marker clustering |
| Validasi | Setiap operasi relevan divalidasi pada frontend, backend, dan database; ketiganya harus bisa diuji secara independen |
| Persistensi | Data bisnis berada di PostgreSQL; seed hanya untuk inisialisasi, bukan pengganti fitur persisten |
| Keamanan | Auth, role, ownership, rate limiting, query terparameterisasi, secret server-only, dan penanganan error aman |
| Web Push | Push nyata melalui Service Worker, VAPID, antrean persisten, dan worker terpisah |
| Object storage | Upload disimpan di object storage; database hanya menyimpan metadata dan referensi |
| Observability | Log terstruktur pada backend dan worker, job gagal dapat ditelusuri |
| Kualitas kode | ESLint, TypeScript disarankan, hindari `any` tanpa alasan, migration dan dokumentasi arsitektur |
| Deployment | Aplikasi dapat dijalankan dari dokumentasi pada lingkungan baru; aplikasi dan worker dikonfigurasi secara terpisah |
| SEO dan konten | Metadata halaman publik dan URL slug; data demo diberi label “Data simulasi” |



## 13. Skenario uji dan verifikasi teknis

### 13.1 Alur bisnis minimum

| Langkah | Aksi | Hasil yang diharapkan |
|---|---|---|
| 1 | Agen login, membuat listing, memilih koordinat, unggah foto, kirim verifikasi | Data tersimpan persisten; status pending; file ada di object storage |
| 2 | Admin menyetujui listing | Status verified dan audit log tersimpan |
| 3 | Pengunjung membuka katalog | Listing tampil konsisten pada daftar dan peta |
| 4 | Pembeli mengajukan kunjungan | Pengajuan tersimpan; job notifikasi agen masuk antrean |
| 5 | Worker memproses antrean | Agen menerima Web Push; klik membuka pengajuan yang relevan |
| 6 | Agen mengubah status pengajuan | Timeline tersimpan dan job push untuk pembeli masuk antrean |
| 7 | Pembeli menerima push dan membuka halaman | Status pengajuan terbaru terlihat |
| 8 | Refresh/logout/login dan buka URL langsung | Data tetap ada dan otorisasi tetap benar |

### 13.2 Validasi tiga lapisan

| Pengujian | Cara | Hasil yang diharapkan |
|---|---|---|
| Frontend | Isi field kosong, format salah, harga negatif, koordinat salah | Form menolak dengan pesan yang jelas |
| Backend | Kirim request langsung tanpa melalui UI dengan payload yang sama | Backend menolak request tidak valid/tidak berhak |
| Database | Jalankan insert/update langsung yang melanggar constraint | PostgreSQL menolak dengan constraint yang sesuai |
| Ownership | Ganti ID listing/pengajuan ke milik pengguna lain | Backend menolak; tidak ada data bocor |
| Race condition | Dua request bersamaan untuk pengajuan aktif yang sama | Constraint/transaksi memastikan hanya kondisi yang valid tersimpan |
| Idempotency | Ulangi request/event yang sama | Tidak membuat duplikasi bisnis atau notifikasi |

### 13.3 Web Push dan worker

- Browser yang mendukung push dapat membuat subscription setelah izin diberikan lewat interaksi pengguna.
- Browser yang tidak mendukung push atau izin ditolak menerima penjelasan dan alur aplikasi tetap berfungsi.
- Kejadian bisnis memasukkan job ke antrean persisten setelah commit transaksi.
- Worker memproses job dan mengirim push; klik notifikasi membuka halaman terkait.
- Simulasikan kegagalan sementara dan pastikan retry terbatas berjalan.
- Subscription tidak valid (404/410) dinonaktifkan/dihapus.
- Job yang gagal dapat ditemukan melalui log/queue monitoring.
- Kegagalan worker atau push tidak membatalkan pengajuan yang sudah tersimpan.
- Jalankan worker sebagai proses terpisah dan verifikasi dokumentasi cara menjalankannya.

### 13.4 Database, storage, security, dan deployment

- Migrasi membangun database dari kosong dan seed mengisi data demo.
- CRUD menggunakan data persisten; data tetap ada setelah refresh dan login ulang.
- Upload berkas valid berhasil; file salah tipe/terlalu besar ditolak oleh server.
- Kredensial database, storage, Redis, dan VAPID private key tidak muncul di browser atau repository.
- Rate limiting aktif pada endpoint rawan.
- Log backend dan worker mencatat error tanpa membocorkan secret.
- Aplikasi berjalan di URL HTTPS dan worker berjalan pada lingkungan terpisah.
- Uji seluruh alur di deployment, bukan hanya localhost.

## 14. Pemetaan Technical Requirements terbaru

| Requirement teknis | Implementasi dalam proyek | Bukti verifikasi |
|---|---|---|
| Next.js, React, JavaScript/TypeScript | App Router, Route Handlers/Server Actions | Source code dan demonstrasi |
| PostgreSQL + ORM/driver | PostgreSQL melalui Prisma/Drizzle/`pg`, bukan PostgREST untuk data bisnis | Query backend, schema dan migration |
| Backend sendiri | Validasi bisnis, auth, ownership, query, upload signing, enqueue | Request langsung dan pemeriksaan kode |
| Validasi tiga lapisan | Zod UI, Zod/backend, constraint DB | Uji terpisah frontend/backend/DB |
| Integritas data | FK, UNIQUE, CHECK, transaksi, indeks, pagination | Uji constraint dan konkurensi |
| Auth dan keamanan | Pemeriksaan server, rate limit, query terparameterisasi, secret server-only | Uji akses lintas peran dan inspeksi konfigurasi |
| Web Push | Service Worker, VAPID, `web-push` | Push nyata dan klik notifikasi |
| Background worker | Worker terpisah + antrean persisten (BullMQ/Redis atau setara) | Worker mati/aktif, retry dan job gagal |
| Object storage | S3-compatible/R2/S3/MinIO, metadata di PostgreSQL | Upload, akses, penolakan file invalid |
| Error handling/observability | Logger terstruktur dan monitoring setara | Log backend/worker dan diagnosis job gagal |
| Kualitas dan performa | Pagination, indeks, hindari N+1, loading/error states, responsive | Pemeriksaan kode dan demonstrasi |
| Deployment/documentation | Git, `.env.example`, migration, ERD, arsitektur, VAPID, worker guide | Setup ulang pada lingkungan baru |
| Testing | CRUD, auth, ownership, migration, push, retry, konsistensi | Matriks test dan demo |
| Data simulasi | Seed untuk inisialisasi, bukan data hardcoded pengganti fitur | Label demo dan persistensi |



## 15. Rencana pengerjaan

| Fase | Isi | Selesai bila |
|---|---|---|
| 0. Fondasi | Repo Git, Next.js, environment, PostgreSQL, Prisma/Drizzle/pg, migration, logger | App berjalan dan database dapat dibangun dari kosong |
| 1. Model data | Tabel, relasi, constraint, indeks, seed, ERD | Migration dan seed berhasil; constraint teruji |
| 2. Auth dan backend | Auth, role, ownership, Route Handlers/Server Actions, Zod backend, rate limiting | Request langsung terlindungi dan aturan bisnis berjalan |
| 3. Object storage | Konfigurasi bucket/container, upload backend, metadata, validasi server | Upload valid berhasil dan file invalid ditolak |
| 4. Alur listing | Agen membuat listing → admin verifikasi → katalog/peta publik | Alur listing berjalan dengan data persisten |
| 5. Pengajuan | Pembeli mengajukan → agen mengubah status → transaksi dan timeline | Aturan status dan transaksi konsisten |
| 6. Web Push | Service Worker, subscription table, VAPID, queue persisten, worker terpisah, retry | Notifikasi nyata terkirim dan kegagalan tidak merusak transaksi |
| 7. Dashboard wajib | Pembeli, agen, admin, rekap, moderasi | KPI berasal dari database dan akses sesuai peran |
| 8. Situs publik | Landing, Products, Facilities, Location, News, Contact | Form dan konten memakai backend/data persisten |
| 9. Uji dan deployment | Uji tiga lapisan, ownership, upload, push, worker, log, responsive, HTTPS | Semua uji inti lolos di deployment |
| 10. Dokumentasi | README, `.env.example`, migration, ERD, arsitektur, VAPID, worker, keterbatasan | Tim lain dapat menjalankan app dan worker dari panduan |

Fitur opsional agen tetap dikerjakan setelah kebutuhan wajib dan semua ketentuan teknis terpenuhi.

## 16. Celah desain dan pertanyaan terbuka

**Belum ada desain, padahal wajib atau diperlukan alur:**

1. Katalog dan peta publik `/properti`, serta detail properti `/properti/[id]`.
2. Dashboard pembeli (favorit, pengajuan, profil) dan halaman register.
3. Halaman "Pasang Properti" untuk pendaftaran agen, dan status `pending` di halaman Users admin (tag "Menunggu Persetujuan" dan tombol "Setujui").
4. Tempat admin membaca `contact_messages` (form kontak dan form penawaran). Usul: tab tambahan di Data Moderation atau halaman "Pesan Masuk".
5. Halaman About dan detail berita (opsional).
6. Section peta persebaran, katalog ringkas, dan pencarian cepat di landing page (lihat FR-PUB-01). Desain landing yang ada belum memuatnya.

**Keputusan yang perlu dikonfirmasi:**

7. Nama brand memakai "Sang Group" sesuai desain terbaru. Ganti bila tim memilih nama lain.
8. Label sidebar berbahasa Inggris sementara isi halaman berbahasa Indonesia. Pilih satu bahasa agar konsisten.
9. Aturan "pengajuan aktif" disamakan di bagian 8.5. Mockup agen memakai dua definisi berbeda untuk tab "Aktif" dan KPI.
10. Lencana Data Moderation di mockup menunjukkan 4. Seed di bagian 11.5 disusun agar cocok.
11. Tanggal pada mockup mengikuti tanggal saat prompt dibuat. PRD memakai tanggal absolut sehingga bisa berbeda dari mockup.
12. Elemen karangan Stitch ("GIS Engine v3.4", sinkronisasi kadaster, ekspor shapefile, layer BPN, versi aplikasi) tidak dimasukkan.

**Data asli yang perlu disiapkan tim:**

13. Koordinat lokasi tiap properti, foto dan denah, foto panorama 360° tiap cluster, isi spesifikasi, harga, alamat kantor pemasaran, dan kontak resmi.

Keputusan terbuka dari pemilik produk ada di bagian 18.

---

## 17. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data listing atau harga tidak mutakhir | Calon pembeli mendapat informasi keliru | Agen memperbarui status, antarmuka menampilkan tanggal pembaruan (`updated_at`), data awal dikonfirmasi ke Sang Group |
| Koordinat tidak akurat | Pin peta menyesatkan | Admin mencocokkan koordinat dengan alamat dan sertifikat lewat kotak pemeriksaan sebelum menyetujui; koordinat ganda terdeteksi di moderasi |
| Site plan, foto, atau logo tidak berizin | Risiko hak penggunaan | Pakai materi yang disediakan atau diizinkan Sang Group dan simpan bukti izinnya |
| Peran dan RLS salah | Data pengguna bocor atau listing diubah pihak lain | RLS di semua tabel dan uji akses lintas peran (bagian 13.2) |
| Peta berat di ponsel | Pengalaman buruk | Muat peta secara dinamis, marker clustering, daftar sebagai alternatif |
| Cakupan terlalu luas | MVP terlambat | Kerjakan alur inti lebih dulu dan tunda halaman opsional (bagian 15) |
| Worker tidak berjalan pada platform serverless | Push tertunda atau hilang | Jalankan worker sebagai proses terpisah pada platform persisten; dokumentasikan restart dan monitoring |
| Redis/queue gagal | Notifikasi tidak terkirim | Gunakan antrean persisten, retry terbatas, log job gagal, dan pastikan transaksi bisnis tetap sukses |
| Kebocoran secret | Database/storage/VAPID disalahgunakan | Secret server-only, `.env.example` tanpa nilai asli, pemeriksaan repository |
| Query langsung melewati backend | Validasi/otorisasi terlewati | Semua akses data bisnis menggunakan ORM/driver dari backend; jangan gunakan PostgREST sebagai pengganti backend |
| Belum ada kesepakatan resmi dengan Sang Group | Data belum final | Bangun demo dengan data simulasi berlabel dan minta persetujuan sebelum dipakai secara komersial |

---

## 18. Keputusan terbuka dari pemilik produk

1. Website hanya demo akademik atau akan dipakai secara komersial. Jawabannya menentukan seberapa ketat label data simulasi dan perizinan.
2. Profil perusahaan, deskripsi, dan materi brand resmi Sang Group, termasuk izin logo.
3. Data resmi tiap perumahan: harga, stok, tipe, koordinat unit, luas kawasan, dan fasilitas (lihat juga butir 13 di bagian 16).
4. Site plan resmi tersedia dan boleh dipakai. Jawabannya menentukan fitur site plan interaktif di bagian 1.4.
5. Agen merupakan akun internal Sang Group atau beberapa agen. Jawabannya memengaruhi alur "Pasang Properti" dan persetujuan agen.
6. Kebijakan pengajuan: siapa yang menerima notifikasi dan batas waktu tindak lanjut (SLA).
7. Domain dan biaya operasional setelah deployment.
