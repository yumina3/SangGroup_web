# SRS v4.0: Website Sistem Informasi Jual Beli Perumahan (GIS) — SANG Group

| Informasi | Keterangan |
|---|---|
| Versi SRS | 4.0 |
| Tanggal | 29 Oktober 2026 |
| Status | Revisi terpadu dengan PRD v4.0 dan Technical Requirements terbaru |
| Mata kuliah | Website Sistem Informasi Jual Beli Perumahan (GIS) |
| Pemilik produk | Kelompok 15 |
| Brand | SANG Group |
| Cakupan awal | Sang Dipa Residence (Candisari), Sang Wira Residence (Tembalang), Sang Naya Residence (Sambiroto) |
| Dokumen acuan | PRD v4.0 dan Technical Requirements — Full-Stack Web Development |
| Stack | Next.js App Router, JavaScript/TypeScript, PostgreSQL via Prisma/Drizzle/pg, Supabase Auth opsional, object storage, Leaflet, Web Push, worker + antrean persisten, Git, Vercel/platform worker |

> **Penting:** Dokumen ini mengikuti PRD v4.0 yang diunggah. Nama, identitas, harga, stok, foto, koordinat, legalitas, fasilitas, dan site plan yang belum dikonfirmasi kepada SANG Group harus ditandai **“Data simulasi”**. Jangan menyajikan data dummy sebagai informasi penjualan resmi.

---

## 1. Pendahuluan

### 1.1 Tujuan

SRS (Software Requirements Specification) ini menetapkan kebutuhan perilaku sistem, validasi tiga lapisan, aturan bisnis, hak akses, persyaratan keamanan, model data, Web Push, background worker, observability, serta skenario pengujian untuk website penjualan perumahan berbasis GIS milik SANG Group. Dokumen ini menjadi acuan implementasi dan pengujian serta harus dibaca bersama PRD v4.0 dan Technical Requirements — Full-Stack Web Development.

### 1.2 Ruang lingkup

Sistem merupakan website yang memasarkan tiga perumahan awal SANG Group di Semarang. Sistem menyediakan katalog dan peta properti, halaman informasi perumahan, detail listing, autentikasi, favorit, pengajuan kunjungan/minat beli, dashboard agen, dashboard admin, serta dashboard pembeli.

Sistem **tidak** memproses pembayaran nyata, tidak mengurus KPR atau kontrak digital, tidak menyediakan marketplace banyak developer, tidak mengintegrasikan CRM/ERP secara otomatis, tidak menjamin stok tanpa pembaruan operasional, dan tidak menyediakan ekspor shapefile, integrasi kadaster/BPN, atau GIS engine khusus. Site plan interaktif hanya dapat ditambahkan sebagai fitur lanjutan jika tersedia dan penggunaannya diizinkan pengembang.

### 1.3 Istilah

| Istilah | Definisi |
|---|---|
| Developer | SANG Group, pemilik portofolio perumahan pada cakupan awal |
| Cluster | Salah satu kawasan/perumahan yang dikelola dalam sistem; pada seed awal: Sang Dipa, Sang Wira, Sang Naya |
| Listing/properti | Unit rumah yang dipasarkan dan memiliki spesifikasi, harga, foto, koordinat, status ketersediaan, dan status verifikasi |
| Pembeli | Pengguna terdaftar yang dapat menyimpan favorit dan mengajukan kunjungan/minat beli |
| Agen | Pengguna yang mengelola listing miliknya dan menindaklanjuti pengajuan yang terkait |
| Admin | Pengguna yang memverifikasi listing, mengelola akun/kategori, memoderasi data, dan melihat rekap |
| GIS | Penyajian data lokasi pada peta digital, dalam sistem ini menggunakan pin berdasarkan koordinat listing |
| Data simulasi | Data contoh/dummy yang belum dikonfirmasi sebagai data resmi |
| Verifikasi | Proses admin menyetujui atau menolak listing sebelum ditampilkan kepada publik |
| Pengajuan | Permintaan pembeli untuk kunjungan atau menyatakan minat beli |
| RLS | Row Level Security, kebijakan akses baris data di PostgreSQL/Supabase |

### 1.4 Referensi dan prioritas

- PRD: *Sang Group, Sistem Informasi Jual Beli Perumahan (GIS)*, versi 3.1, 29 Oktober 2026.
- Ketentuan rinci yang menjadi dasar SRS: bagian 3–13 PRD, termasuk peran, arsitektur, peta halaman, kebutuhan fungsional, aturan bisnis, model data, keamanan, seed, kebutuhan non-fungsional, dan skenario uji.
- **Wajib (W):** diperlukan untuk alur minimum tugas dan uji penerimaan.
- **Pendukung (P):** bagian desain/produk yang dikerjakan setelah alur wajib berjalan.
- **Opsional (O):** boleh ditunda sesuai waktu tim.

---

## 2. Gambaran sistem dan lingkungan operasi

### 2.1 Arsitektur teknis wajib

| Komponen | Persyaratan |
|---|---|
| Frontend/backend | Next.js App Router, React, JavaScript; TypeScript disarankan dan diperbolehkan |
| Backend API | Route Handlers dan/atau Server Actions untuk operasi bisnis |
| Database | PostgreSQL; host boleh Supabase PostgreSQL atau provider lain |
| Akses database | Prisma (pilihan default), Drizzle, atau `pg` dari server; dilarang memakai PostgREST sebagai pengganti backend |
| Autentikasi | Supabase Auth dapat dipertahankan sebagai provider identitas, atau solusi setara; role/ownership tetap diverifikasi backend |
| Validasi | Zod atau setara di frontend dan backend, ditambah constraint database |
| Peta | Leaflet dan `react-leaflet` dengan OpenStreetMap |
| File | Object storage seperti S3-compatible storage, Cloudflare R2, Amazon S3, MinIO atau setara |
| Web Push | Service Worker, VAPID, `web-push` |
| Queue/worker | Antrean persisten seperti BullMQ + Redis atau setara; worker proses terpisah |
| Logging | Pino/Winston atau setara; error monitoring seperti Sentry bila tersedia |
| Version control | Git dan repository remote |
| Deployment | Aplikasi web pada Vercel/platform setara; worker pada platform yang mendukung proses persisten dan berjalan terpisah |

**Larangan:** Supabase client/PostgREST atau API sejenis tidak boleh menggantikan implementasi backend. Supabase boleh menjadi penyedia Auth dan host PostgreSQL, tetapi query data bisnis wajib melalui backend Next.js dengan ORM/driver.

### 2.2 Alur arsitektur

```text
Browser + UI + Service Worker
       ↓ HTTPS
Next.js Route Handler / Server Action
       ├─ verifikasi sesi, role, ownership
       ├─ validasi request dan aturan bisnis (Zod)
       ├─ Prisma/Drizzle/pg → PostgreSQL
       ├─ backend upload/signing → object storage
       └─ enqueue job setelah transaksi bisnis berhasil
                    ↓
             antrean persisten
                    ↓
          background worker terpisah
                    ↓
          web-push + VAPID → browser
```

### 2.3 Environment variables

| Variabel | Aturan |
|---|---|
| `DATABASE_URL` | Server/worker saja; koneksi PostgreSQL |
| `DIRECT_URL` | Opsional untuk migration jika dibutuhkan provider/ORM |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Hanya bila Supabase Auth digunakan; bukan untuk query data bisnis |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Object storage; kredensial server-only |
| `VAPID_PUBLIC_KEY` / `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public key untuk subscription browser |
| `VAPID_PRIVATE_KEY` | Server/worker saja |
| `VAPID_SUBJECT` | Identitas VAPID |
| `REDIS_URL` | Server/worker saja |
| `LOG_LEVEL` | Konfigurasi logging sesuai lingkungan |

Sediakan `.env.example` tanpa secret. Jangan menyimpan nilai rahasia di repository, HTML, bundle browser, atau log.

### 2.4 Lingkungan dan responsif

Sistem harus berjalan di URL HTTPS untuk Web Push di luar lingkungan lokal yang memenuhi secure context browser. Login, CRUD, upload, katalog/peta, pengajuan, notifikasi, dan worker harus diuji pada deployment. Aplikasi web dan worker mempunyai deployment/proses yang dapat dijalankan secara terpisah.

Breakpoints acuan:
- Desktop: 1024 px ke atas.
- Tablet: 640–1023 px.
- Ponsel: di bawah 640 px.

Di ponsel, sidebar berubah menjadi menu ringkas/hamburger, tabel menjadi bentuk yang dapat dibaca, layout dua kolom menjadi satu kolom, dan peta menyediakan tab **Daftar** dan **Peta**.

## 3. Peran, autentikasi, dan otorisasi

### 3.1 Matriks hak akses

| Kemampuan | Pengunjung | Pembeli | Agen | Admin |
|---|---:|---:|---:|---:|
| Melihat halaman publik, katalog, peta, detail listing terverifikasi | Ya | Ya | Ya | Ya |
| Mengirim formulir kontak/penawaran | Ya | Ya | Ya | Ya |
| Menyimpan/menghapus favorit | Tidak | Milik sendiri | Tidak | Baca sesuai kebijakan |
| Membuat pengajuan kunjungan/minat beli | Tidak | Ya | Tidak | Tidak |
| Melihat status pengajuan sendiri | Tidak | Ya | Tidak | Tidak |
| Membuat dan mengubah listing | Tidak | Tidak | Listing milik sendiri | Semua sesuai fungsi admin |
| Mengirim listing untuk verifikasi | Tidak | Tidak | Listing milik sendiri | Tidak diperlukan |
| Menindaklanjuti pengajuan | Tidak | Tidak | Pengajuan listing miliknya | Baca |
| Menyetujui/menolak listing | Tidak | Tidak | Tidak | Ya |
| Menyetujui akun agen | Tidak | Tidak | Tidak | Ya |
| Mengelola kategori tipe dan cluster | Tidak | Tidak | Tidak | Ya |
| Memoderasi listing/pengajuan/pengguna | Tidak | Melaporkan listing | Tidak | Ya |
| Melihat rekap seluruh properti dan pengajuan | Tidak | Tidak | Data sendiri sesuai halaman | Ya |
| Mengubah peran sendiri | Tidak | Tidak | Tidak | Tidak |

Matriks ini harus diterapkan di UI, Server Action/Route Handler, kebijakan RLS, dan fungsi RPC. Menyembunyikan tombol/menu saja tidak memenuhi persyaratan otorisasi.

### 3.2 Siklus akun

1. Pembeli mendaftar melalui `/register`; akun menjadi `active`.
2. Agen mendaftar melalui `/pasang-properti`; akun menjadi `pending` dan tidak boleh mengakses dashboard sampai disetujui admin.
3. Admin dibuat melalui seed atau Supabase; tidak ada pendaftaran admin publik.
4. Trigger `handle_new_user` hanya menerima peran dari metadata pendaftaran berupa `buyer` atau `agent`. Nilai lain harus menjadi `buyer`; peran tidak boleh diambil dari input profil biasa.
5. Akun `inactive` tidak boleh masuk.
6. Pengguna tanpa sesi yang membuka dashboard diarahkan ke `/login`. Pengguna dengan peran salah diarahkan ke dashboard sesuai peran atau menerima halaman 403.
7. Pengguna tidak boleh mengubah `role` atau `status` miliknya sendiri.

### 3.3 Pengalihan setelah login

| Kondisi | Perilaku |
|---|---|
| Pembeli aktif | Arahkan ke `/pembeli` |
| Agen aktif | Arahkan ke `/agen` |
| Admin aktif | Arahkan ke `/admin` |
| Agen pending | Tampilkan pesan akun menunggu persetujuan |
| Akun inactive | Tampilkan pesan akun nonaktif |
| Sesi tidak ada saat membuka dashboard | Arahkan ke `/login` dengan pesan akses memerlukan login |

---

## 4. Kebutuhan fungsional

### 4.1 Situs publik dan katalog

**FR-PUB-01 — Landing page (`/`).**
- Menampilkan hero, profil singkat SANG Group, nilai/keunggulan, tiga perumahan, peta persebaran, katalog ringkas, pencarian cepat, dan ajakan kontak.
- Tiga perumahan awal: Sang Dipa (Candisari), Sang Wira (Tembalang), dan Sang Naya (Sambiroto).
- Peta dan katalog hanya menampilkan listing terverifikasi yang tidak disembunyikan.
- Katalog ringkas menampilkan maksimal enam properti terbaru.
- Pencarian cepat meneruskan lokasi, rentang harga, dan tipe ke `/properti`.
- Jumlah listing per wilayah dihitung dari database, bukan angka statis.

**FR-PUB-02 — Halaman perumahan (`/products/[slug]`).**
- Setiap perumahan menggunakan template dengan enam bagian: hero; ambience/keamanan; fasilitas taman; clubhouse/fasilitas; spesifikasi dan tipe cluster; denah serta galeri.
- Konten harus berasal dari `clusters`, `cluster_specs`, `property_types`, `facilities`, dan `property_photos`.
- Materi foto, fasilitas, denah, keamanan, legalitas, dan spesifikasi yang belum disahkan diberi status simulasi atau tidak ditampilkan sebagai klaim resmi.
- Memilih tipe rumah memuat denah yang sesuai bila tersedia.

**FR-PUB-03 — Fasilitas (`/facilities`).**
- Menampilkan hero, blok fasilitas, carousel fasilitas olahraga, dan ajakan.
- Sumber data adalah `facilities`.

**FR-PUB-04 — Lokasi (`/location`).**
- Pengunjung memilih Sang Dipa, Sang Wira, atau Sang Naya; Sang Dipa menjadi pilihan awal.
- Mode Peta menampilkan pin lokasi dan memperbesar peta ke perumahan aktif.
- Mode Tampilan 360° hanya aktif jika foto panorama tersedia.
- Panel detail menampilkan nama, wilayah, deskripsi, fakta akses, karakteristik lahan, legalitas, dan rentang harga dari properti terverifikasi.
- Rentang harga dihitung dari `min(price)` dan `max(price)` untuk listing terverifikasi pada cluster terkait.
- Tombol mengarahkan pengguna ke penjadwalan survei atau detail perumahan sesuai implementasi yang tersedia.

**FR-PUB-05 — Berita (`/news`, `/news/[slug]`).**
- Daftar berita menampilkan satu berita utama dan tiga berita kecil, serta grid berita dengan filter kategori/perumahan dan pagination.
- Form penawaran memuat nama, email, WhatsApp, dan kota; data disimpan di `contact_messages` dengan `kind = 'offer'`.
- Detail berita hanya menampilkan artikel yang dipublikasikan.

**FR-PUB-06 — Kontak (`/contact`).**
- Menampilkan kontak dan kantor pemasaran serta formulir nama, WhatsApp, perumahan yang diminati, dan pesan.
- Formulir disimpan ke `contact_messages` dengan `kind = 'contact'`.
- Kontak yang belum dikonfirmasi harus jelas ditandai sebagai contoh/fiktif.

**FR-PUB-07 — Katalog dan peta (`/properti`).**
- Hanya listing `verification = 'verified'` dan `is_hidden = false` yang boleh tampil ke publik.
- Filter: pencarian teks, cluster/lokasi, rentang harga, luas tanah, luas bangunan, tipe, dan ketersediaan.
- Daftar dan peta sinkron dua arah: filter memperbarui daftar/pin; memilih kartu menyorot pin; memilih pin menyorot kartu.
- Pin menggunakan `lat`/`lng` dari database dan warna mengikuti status ketersediaan.
- Pagination server-side 12 item per halaman.
- Kartu menampilkan tanggal pembaruan dari `updated_at`.
- Gunakan marker clustering saat pin banyak.
- Di ponsel, sediakan tab Daftar/Peta.

**FR-PUB-08 — Detail properti (`/properti/[id]`).**
- Menampilkan galeri foto dengan teks alt, spesifikasi, harga, status ketersediaan, tanggal pembaruan, mini map, koordinat, dan denah jika ada.
- Tombol favorit hanya tersedia untuk pembeli login; pengunjung diarahkan ke login.
- Form pengajuan menyediakan jenis kunjungan atau minat beli, pesan, dan tanggal/jam kunjungan untuk jenis kunjungan.
- Properti `booked` atau `sold` menampilkan status dan menonaktifkan pengajuan baru.
- Data yang berstatus demo menampilkan label “Data simulasi”.

**FR-PUB-09 — Login dan registrasi.**
- Login menggunakan Supabase Auth.
- Tidak ada pemilih peran di form login.
- Registrasi pembeli tersedia di `/register`; pendaftaran agen melalui `/pasang-properti`.
- Validasi dan pesan untuk akun pending/inactive harus jelas.

### 4.2 Dashboard pembeli

**FR-BUY-01 — Ringkasan (`/pembeli`).** Menampilkan jumlah favorit, pengajuan aktif, dan pengajuan terbaru milik pembeli.

**FR-BUY-02 — Favorit (`/pembeli/favorit`).** Menampilkan listing favorit milik pembeli, mengizinkan penghapusan favorit, dan menyediakan tautan ke detail. Listing yang tidak lagi terverifikasi diberi label “Tidak tersedia”.

**FR-BUY-03 — Pengajuan (`/pembeli/pengajuan`).** Menampilkan pengajuan milik pembeli, jenis, properti, tanggal, status, dan timeline dari `inquiry_updates`. Pembeli hanya dapat membatalkan pengajuan berstatus `new`.

**FR-BUY-04 — Profil (`/pembeli/profil`).** Pembeli dapat mengubah nama, nomor WhatsApp, dan kata sandi. Email dan peran hanya baca.

### 4.3 Dashboard agen

**FR-AGT-01 — Dashboard (`/agen`).**
- Menampilkan total listing, listing menunggu verifikasi, pengajuan aktif, properti terjual, pengajuan terbaru, komposisi listing, dan kunjungan terdekat.
- Listing ditolak menampilkan alasan penolakan dan tautan untuk memperbaiki.

**FR-AGT-02 — Daftar listing (`/agen/properti`).**
- Menampilkan foto, nama, lokasi, harga, ketersediaan, status verifikasi, jumlah pengajuan, dan aksi.
- Mendukung pencarian, filter status/ketersediaan/tipe/pengajuan aktif, dan pagination.
- Agen hanya dapat mengelola listing miliknya.
- Aksi hapus hanya tersedia untuk listing `draft` atau `rejected`.

**FR-AGT-03 — Form listing (`/agen/properti/baru`, `/agen/properti/[id]/edit`).**
- Form terdiri atas informasi dasar, spesifikasi/harga, lokasi, dan foto.
- Lokasi dapat diisi dengan klik peta atau input koordinat manual.
- Foto diunggah ke object storage dan menampilkan progres/galat per berkas.
- Tersedia “Simpan sebagai Draft” dan “Kirim untuk Verifikasi”.
- Pengiriman memvalidasi kelengkapan dan mengubah status verifikasi ke `pending`.

**FR-AGT-04 — Pipeline (`/agen/pipeline`).**
- Menyediakan tampilan papan dan daftar dengan tahap Baru, Konsultasi, Dijadwalkan, Selesai Kunjungan, Negosiasi, Deal, dan Batal.
- Agen dapat mengubah tahap; tahap Deal wajib memilih status properti `booked` atau `sold`.
- Tahap Batal mewajibkan alasan.
- Perubahan status menambahkan baris ke `inquiry_updates`.
- Detail pengajuan hanya dapat dilihat/diubah oleh agen pemilik listing terkait.

**FR-AGT-05 — Masterplan GIS (`/agen/masterplan`).**
- Menampilkan listing milik agen, pin berdasarkan ketersediaan, penanda untuk listing dengan pengajuan aktif, popup ringkas, dan daftar sinkron.

**FR-AGT-06 — Pengaturan (`/agen/pengaturan`).**
- Agen dapat mengubah nama, nomor WhatsApp, nama agensi, foto profil, dan kata sandi.
- Email dan peran hanya baca; agen tidak dapat menaikkan peran sendiri.

**FR-AGT-07 s.d. FR-AGT-14 — Halaman opsional.**
- Leads, Tasks, Contacts, Messages, Sales Analytics, Agent Performance, Conversion Funnel, Integrations, dan Help Center dapat dikerjakan setelah semua kebutuhan wajib terpenuhi.
- `tasks` dan `messages` hanya diperlukan bila halaman terkait benar-benar diimplementasikan.
- Jika Messages tidak dibuat, sediakan tautan `wa.me` sesuai PRD.

### 4.4 Dashboard admin

**FR-ADM-01 — Dashboard (`/admin`).** Menampilkan total properti non-draft, menunggu verifikasi, total pengguna, total pengajuan, antrean verifikasi, komposisi status listing, dan aktivitas terbaru dari `audit_log`.

**FR-ADM-02 — Verifikasi listing (`/admin/verifikasi`).**
- Menampilkan antrean dan panel tinjauan listing.
- Admin memeriksa kelengkapan data, kejelasan foto, kesesuaian koordinat/alamat/dokumen, serta kewajaran harga.
- “Setujui & Tayangkan” mengubah status ke `verified` dan membuat listing tampil di katalog/peta.
- “Tolak Listing” mewajibkan alasan; alasan terlihat oleh agen.
- Keputusan mencatat admin, waktu, dan catatan.

**FR-ADM-03 — Pengguna (`/admin/pengguna`).**
- Menampilkan nama, email, peran, status, tanggal bergabung, filter, pencarian, pagination, dan aksi.
- Admin dapat menambah/mengedit pengguna, mengubah peran, menonaktifkan akun, dan menyetujui agen pending.
- Admin tidak boleh menonaktifkan atau menurunkan peran akunnya sendiri.

**FR-ADM-04 — Kategori (`/admin/kategori`).**
- Mengelola tipe properti (`property_types`) dan cluster (`clusters`).
- Kode harus unik; nama wajib diisi.
- Penghapusan kategori ditolak jika masih digunakan oleh listing.

**FR-ADM-05 — Moderasi (`/admin/moderasi`).**
- Mengelola laporan listing, pengajuan, dan pengguna dengan status Perlu Ditinjau, Ditindak, atau Diabaikan.
- Sumber laporan dapat berupa sistem atau pembeli.
- Aksi Sembunyikan mengeluarkan listing dari katalog/peta; Hapus memerlukan konfirmasi; Abaikan mencatat keputusan.
- Catatan admin wajib saat memproses laporan.

**FR-ADM-06 — Rekap properti (`/admin/rekap`).**
- Filter berdasarkan periode, cluster, kategori, agen, dan status.
- Menampilkan KPI jumlah properti, tersedia, dipesan, terjual, nilai listing, grafik per cluster/kategori, rekap per agen, dan daftar properti.
- Mendukung ekspor CSV berdasarkan filter aktif dan cetak browser.
- Menampilkan rekap pengajuan menurut status, jenis, dan agen.
- Semua angka dihitung dari database.

**FR-ADM-07 — Masterplan GIS (`/admin/masterplan`).**
- Menampilkan seluruh listing non-draft, dengan label harga dan warna status verifikasi.
- Mendukung pencarian dan filter cluster, kategori, ketersediaan, serta verifikasi.
- Panel detail menampilkan foto, harga, status, fakta, agen, dan tautan untuk meninjau listing.

**FR-ADM-08 — Pengaturan (`/admin/pengaturan`).**
- Admin dapat mengubah nama, WhatsApp, foto profil, dan kata sandi.
- Email dan peran hanya baca.

### 4.5 Kebutuhan penyimpanan file

- Foto properti dan denah disimpan di object storage pada container/bucket `property-photos`.
- Foto profil disimpan di object storage `avatars`.
- Sampul berita disimpan di object storage `news-covers`.
- Foto panorama disimpan di object storage `panoramas`.
- PostgreSQL menyimpan `storage_path`/object key dan metadata; jangan menyimpan file sebagai Base64.
- Batas file foto: JPG, PNG, WebP, maksimal 2 MB per file, 1–8 foto per listing dan tepat satu foto utama.
- Panorama maksimal 8 MB.
- Hak baca/tulis object storage harus diperiksa di backend; gunakan signed URL berumur pendek untuk berkas privat.

---

## 5. Aturan bisnis dan siklus status

### 5.1 Siklus verifikasi listing

```text
draft → pending → verified
             └→ rejected → diperbaiki dan dikirim ulang → pending
```

- Hanya admin yang boleh mengubah listing menjadi `verified` atau `rejected`.
- Pengiriman untuk verifikasi harus memastikan koordinat dan minimal satu foto tersedia.
- Perubahan alamat, koordinat, harga, atau foto pada listing yang sudah terverifikasi mengubah status verifikasi kembali menjadi `pending`.
- Perubahan ketersediaan tidak mengubah status verifikasi.
- Listing tersembunyi tidak ditampilkan ke publik, tetapi tetap dapat dilihat oleh pemilik dan admin.
- Admin tidak melihat listing berstatus `draft`.

### 5.2 Siklus ketersediaan properti

Nilai yang valid: `available`, `booked`, `sold`.

- Hanya listing terverifikasi dan tersedia (`available`) yang dapat menerima pengajuan baru.
- Agen dapat memperbarui ketersediaan sesuai kewenangannya.
- Perubahan ke `sold` tidak dapat dibatalkan oleh agen; koreksi dilakukan admin.
- Saat pengajuan mencapai `deal`, sistem harus memperbarui status pengajuan dan ketersediaan properti dalam satu transaksi database.

### 5.3 Siklus pengajuan

```text
new → consultation → scheduled → visit_done → negotiation → deal
 \________________ dapat menjadi cancelled sebelum deal ______________/
```

- Agen boleh melompati tahap bila sesuai tindak lanjut nyata.
- `scheduled` wajib memiliki tanggal dan jam kunjungan.
- `cancelled` wajib memiliki alasan minimal 10 karakter.
- `deal` wajib memilih status properti `booked` atau `sold`.
- Pembeli hanya dapat membatalkan pengajuan miliknya ketika status `new`.
- Satu pembeli hanya boleh memiliki satu pengajuan aktif per properti. Pengajuan berstatus `deal` atau `cancelled` tidak dianggap aktif untuk constraint ini.

### 5.4 Definisi KPI

**Agen**
- Total Listing: semua listing milik agen, termasuk draft.
- Menunggu Verifikasi: `verification = 'pending'`.
- Pengajuan Aktif: pengajuan milik agen selain `deal` dan `cancelled`, termasuk `new`.
- Properti Terjual: listing dengan `availability = 'sold'`.
- Total nilai listing aktif: jumlah harga untuk listing yang tidak berstatus `sold`.
- Kunjungan terdekat: jadwal `scheduled` paling awal yang belum lewat.

**Admin**
- Total Properti: listing dengan status verifikasi selain `draft`.
- Menunggu Verifikasi: listing `pending`.
- Total Pengguna: jumlah profil, dengan pemisahan peran.
- Total Pengajuan: jumlah semua pengajuan.
- Status Listing: agregasi status verifikasi tanpa draft.
- Total Nilai Listing: jumlah harga untuk listing non-draft.
- Lencana moderasi: laporan berstatus `pending`.
- Lencana verifikasi: listing berstatus `pending`.

Seluruh KPI harus dihitung dari database sesuai peran dan RLS; jangan mengisi angka dashboard secara statis.

---

## 6. Persyaratan validasi

Semua validasi dilakukan di tiga lapisan bila relevan: UI untuk umpan balik cepat, server melalui Zod/Server Action, dan database melalui constraint/trigger. Validasi server dan database wajib meskipun validasi klien sudah tersedia.

### 6.1 Validasi listing dan kategori

| Field | Aturan |
|---|---|
| Nama properti | Wajib, 5–120 karakter |
| Harga | Bilangan bulat lebih dari 0 |
| Luas tanah | Angka lebih dari 0 |
| Luas bangunan | Angka lebih dari 0 |
| Kamar tidur | Bilangan bulat 0–20 |
| Kamar mandi | Bilangan bulat 0–20 |
| Jumlah lantai | Bilangan bulat 1–5 |
| Latitude | -90 sampai 90; wajib saat dikirim untuk verifikasi |
| Longitude | -180 sampai 180; wajib saat dikirim untuk verifikasi |
| Foto | JPG/PNG/WebP; maksimal 2 MB; 1–8 foto; satu foto utama |
| Kode kategori | Huruf besar dan angka, 2–10 karakter, unik dalam tabel terkait |
| Nama kategori | Wajib |
| Slug | Unik jika digunakan di URL |
| Tanggal pembaruan | Diperbarui saat data listing berubah |

Pesan validasi utama:
- “Nama properti wajib diisi (5 sampai 120 karakter)”
- “Harga tidak boleh negatif atau nol”
- “Luas harus lebih dari 0”
- “Jumlah tidak valid”
- “Jumlah lantai tidak valid”
- “Latitude harus di antara -90 dan 90”
- “Longitude harus di antara -180 dan 180”
- “Ukuran berkas melebihi 2 MB”
- “Format berkas tidak didukung”
- “Kode sudah digunakan”
- “Nama wajib diisi”

### 6.2 Validasi pengajuan dan akun

| Field | Aturan |
|---|---|
| Tanggal kunjungan | Tidak boleh sebelum hari ini berdasarkan WIB |
| Pesan pengajuan | Maksimal 500 karakter |
| Nomor WhatsApp | Format Indonesia 08xx atau +62xx, 9–14 digit sesuai normalisasi |
| Email | Format email valid dan unik untuk akun |
| Kata sandi | Minimal 8 karakter, kombinasi huruf dan angka |
| Alasan penolakan | Wajib, minimal 10 karakter |
| Alasan pembatalan | Wajib, minimal 10 karakter |
| Jadwal pengajuan `scheduled` | Tanggal dan jam wajib |
| Pengajuan duplikat | Ditolak untuk pembeli/properti yang sama selama pengajuan sebelumnya masih aktif |

Pesan validasi utama:
- “Tanggal kunjungan tidak valid”
- “Pesan terlalu panjang”
- “Nomor WhatsApp tidak valid”
- “Email sudah terdaftar”
- “Minimal 8 karakter, kombinasi huruf dan angka”
- “Alasan wajib diisi”

### 6.3 Pencegahan pengiriman berulang

- Tombol submit menjadi nonaktif dan menampilkan spinner selama permintaan berjalan.
- Server/database mencegah duplikasi, bukan hanya tombol di browser.
- Pengguna menerima toast atau pesan sukses/gagal yang jelas.
- Tindakan destruktif menggunakan dialog konfirmasi.

---

## 7. Persyaratan data dan database

### 7.1 Teknologi dan migration

- Gunakan PostgreSQL dengan Prisma (default), Drizzle, atau `pg` dari backend Next.js.
- Sediakan migration files yang dapat membangun database dari kondisi kosong; perubahan skema tidak dilakukan manual tanpa migration.
- Seed hanya untuk inisialisasi dan pengujian, bukan pengganti fitur yang membaca/menulis data persisten.
- Gunakan transaksi untuk operasi multi-langkah yang harus konsisten, terutama perubahan status pengajuan menjadi deal dan ketersediaan properti.
- Gunakan query terparameterisasi/ORM, pagination server-side, indeks sesuai pola query, serta hindari N+1 dan pengambilan data berlebihan.
- Jangan gunakan Supabase PostgREST sebagai pengganti backend. Supabase dapat menjadi host PostgreSQL; akses data bisnis tetap melalui backend sendiri.

### 7.2 Enum

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

### 7.3 Tabel bisnis

| Tabel | Kolom utama dan tujuan |
|---|---|
| `profiles` | `id`, `full_name`, `email`, `phone`, `role`, `status`, `agency_name`, `avatar_path` |
| `clusters` | `code`, `name`, `slug`, `area`, `address`, `description`, `cover_path`, kontak, `lat`, `lng`, `panorama_path`, fakta akses/legalitas, `sort_order`, `is_active`, `is_demo` |
| `property_types` | `code`, `name`, `description` |
| `properties` | pemilik, cluster, tipe, judul/slug, deskripsi, alamat, koordinat, harga, luas, kamar, lantai, sertifikat, ketersediaan, verifikasi, alasan penolakan, `is_hidden`, waktu verifikasi, `updated_at`, `is_demo` |
| `property_photos` | `property_id`, `storage_key`, `alt_text`, `kind`, `is_cover`, `sort_order`, ukuran, MIME type, uploader |
| `favorites` | `buyer_id`, `property_id`, unik pada pasangan |
| `inquiries` | properti, pembeli, agen, jenis, status, pesan, tanggal kunjungan, alasan pembatalan, `updated_at` |
| `inquiry_updates` | `inquiry_id`, status, catatan, jadwal, `created_by` |
| `moderation_reports` | target, alasan, sumber, pelapor, status, catatan admin, penanggung jawab, waktu |
| `audit_log` | aktor, aksi, entitas, ID entitas, detail aman, waktu |
| `push_subscriptions` | pengguna, endpoint, `p256dh`, `auth`, user-agent opsional, status aktif, waktu terakhir digunakan, waktu kedaluwarsa/invalid |
| `notification_jobs` (opsional bila tidak memakai tabel queue internal) | idempotency key, tipe event, payload minimum, status, attempts, `available_at`, `processed_at`, error ringkas |
| `cluster_specs` | spesifikasi halaman perumahan |
| `facilities` | data fasilitas dan foto |
| `news_posts` | artikel publik |
| `contact_messages` | pesan kontak/penawaran |
| `tasks`, `messages` | opsional sesuai halaman agen |

Queue persisten dapat dikelola oleh BullMQ/Redis. `notification_jobs` hanya diperlukan jika dipilih sebagai outbox/pola antrean database atau pencatatan bisnis; jangan membuat dua sistem queue tanpa kebutuhan jelas.

### 7.4 Relasi, constraint, dan indeks

- Pertahankan relasi yang telah ditentukan pada SRS v3.1 untuk profil, cluster, tipe, listing, foto, favorit, pengajuan, timeline, moderasi, konten, dan audit.
- `favorites`: `UNIQUE (buyer_id, property_id)`.
- `clusters.code`, `clusters.slug`, `property_types.code`, dan slug properti unik.
- `properties.price > 0`; koordinat valid pada rentang latitude/longitude; jumlah kamar dan lantai memiliki batas sesuai bagian validasi.
- Maksimal satu foto utama per listing.
- Indeks pada `properties(verification, availability)`, `properties(cluster_id)`, `properties(owner_id)`, `inquiries(agent_id, status)`, `inquiries(buyer_id)`, dan `push_subscriptions(user_id, is_active)`.
- Constraint unik parsial untuk satu pengajuan aktif per pembeli/properti, sesuai dukungan PostgreSQL.
- Operasi multi-tabel yang saling bergantung memakai transaksi. Pertimbangkan race condition pada pengajuan ganda dan perubahan ketersediaan.

### 7.5 Trigger/fungsi dan logika backend

- Pertahankan fungsi bisnis `submit_for_verification`, `approve_property`, `reject_property`, `update_inquiry_status`, dan `close_deal` dari SRS sebelumnya, diimplementasikan melalui backend/ORM dan/atau fungsi database sesuai kebutuhan.
- Pemeriksaan role dan ownership dilakukan pada backend untuk setiap operasi; trigger/constraint database melindungi integritas tambahan.
- `close_deal` harus mengubah status pengajuan dan properti secara atomik.
- Saat transaksi bisnis berhasil, backend membuat job notifikasi persisten. Job tidak dikirim sebelum commit transaksi.
- Statistik dashboard dihitung dari query database, bukan angka statis.

## 8. Keamanan, file, notifikasi, dan observability

### 8.1 Autentikasi dan otorisasi

- Autentikasi dapat menggunakan Supabase Auth atau solusi setara; setiap request terlindungi harus diverifikasi pada backend.
- Pemeriksaan role, status akun, dan kepemilikan data wajib dilakukan pada server Route Handler/Server Action. Jangan mempercayai role, harga, status, `owner_id`, `buyer_id`, atau identitas aktor dari client.
- Semua query data bisnis memakai Prisma/Drizzle/`pg` dari backend Next.js, bukan PostgREST.
- Gunakan query terparameterisasi/ORM aman, rate limiting pada endpoint rawan, dan pesan error publik yang tidak membocorkan detail internal.
- Jika password dikelola sendiri, hash menggunakan algoritma yang sesuai. Jika memakai Supabase Auth, jangan menyimpan password mentah atau hash duplikat.
- RLS dapat dipakai sebagai defense-in-depth jika sesuai konfigurasi database, tetapi tidak menggantikan pemeriksaan backend.

### 8.2 Object storage

| Bucket/container | Isi | Akses |
|---|---|---|
| `property-photos` | Foto dan denah | Aset listing publik hanya tampil bila listing diizinkan; unggah pemilik/admin |
| `avatars` | Foto profil | Sesuai kebijakan profil |
| `news-covers` | Sampul berita | Baca publik, tulis admin |
| `panoramas` | Foto 360° | Baca publik untuk cluster aktif, tulis admin |
| `private-uploads` | Jika ada file privat | Tidak publik; unduh melalui backend/signed URL berumur pendek |

- Gunakan S3-compatible storage, Cloudflare R2, Amazon S3, MinIO atau setara.
- PostgreSQL menyimpan metadata dan key/path, bukan isi file Base64.
- Validasi ukuran, tipe MIME/ekstensi, dan hak akses file di server. Jangan percaya validasi browser saja.
- Kredensial storage tidak boleh masuk bundle browser. Signed URL privat harus dibuat oleh backend dan memiliki masa berlaku terbatas.
- Batas gambar produk: JPG/PNG/WebP, foto maksimal 2 MB, 1–8 foto per listing dengan satu foto utama; panorama maksimal 8 MB.

### 8.3 Web Push dan background worker — wajib

Kejadian bisnis minimum yang memicu notifikasi:
1. Pembeli membuat pengajuan baru → agen pemilik listing menerima push.
2. Agen memperbarui status pengajuan → pembeli terkait menerima push.
3. Admin menyetujui/menolak listing → agen pemilik menerima push.

Alur: transaksi bisnis berhasil → job masuk antrean persisten → worker terpisah memproses job → `web-push` mengirim lewat VAPID → Service Worker menangani `push` → `notificationclick` membuka halaman relevan.

Persyaratan:
- Meminta izin notifikasi hanya setelah interaksi pengguna.
- Menyimpan subscription di PostgreSQL dan menghubungkannya dengan akun/identitas yang sesuai.
- Endpoint subscribe/unsubscribe terautentikasi dan memeriksa kepemilikan subscription.
- VAPID private key hanya tersedia pada server/worker; public key boleh dipakai browser.
- Gunakan BullMQ + Redis atau antrean persisten setara.
- Retry terbatas dengan backoff, idempotency/deduplication, pencatatan kegagalan, dan penanganan subscription invalid (mis. 404/410).
- Kegagalan push/worker tidak boleh membatalkan transaksi bisnis yang sudah tersimpan.
- Tangani browser tidak mendukung push, izin ditolak, subscription tidak valid, serta job gagal.
- Worker berjalan sebagai proses terpisah; dokumentasi menjelaskan cara menjalankan dan memeriksa statusnya.

### 8.4 Logging dan observability

- Gunakan Pino/Winston atau logger terstruktur setara untuk backend dan worker.
- Catat ID request/job, jenis event, waktu/durasi, status, attempts, dan ringkasan error.
- Jangan mencatat password, token, private key, kredensial, atau data sensitif yang tidak diperlukan.
- Sediakan cara menemukan job gagal dan melakukan retry terkontrol.
- Sentry atau error monitoring setara disarankan; tracing penuh tidak wajib jika belum diperlukan.

### 8.5 Privasi data pembeli

Email dan WhatsApp pembeli hanya dapat dibaca oleh agen pemilik listing terkait dan admin sesuai kebutuhan. Pengunjung publik tidak dapat membaca pengajuan, profil privat, subscription, atau pesan orang lain. Subscription push tidak boleh dipublikasikan. `audit_log` hanya dapat dibaca oleh admin dan ditulis melalui operasi tepercaya.

## 9. Kebutuhan non-fungsional

| ID | Aspek | Persyaratan |
|---|---|---|
| NFR-01 | Responsif | Desktop, tablet, ponsel; peta dan form usable di layar kecil |
| NFR-02 | UI states | Setiap daftar/form memiliki loading, empty, success, dan error state |
| NFR-03 | Pagination | Tabel dashboard 10 baris/halaman; katalog 12 item/halaman; pagination dijalankan di server |
| NFR-04 | Performa | Indeks sesuai query, hindari N+1, query berulang, dan pengambilan data berlebihan; caching dilakukan secara sadar |
| NFR-05 | Aksesibilitas | Label form, fokus keyboard, alt text, kontras memadai, semua alur inti dapat dioperasikan dengan keyboard |
| NFR-06 | SEO | Metadata dan Open Graph pada halaman publik serta URL slug konsisten |
| NFR-07 | Bahasa | Bahasa utama Indonesia; toggle ID/EN hanya visual dan bukan fitur wajib |
| NFR-08 | Keamanan | Pemeriksaan autentikasi, role, ownership di server; rate limiting; query aman; secret server-only |
| NFR-09 | Validasi | Validasi frontend, backend, dan database wajib serta dapat diuji secara independen |
| NFR-10 | Persistensi | Data bisnis tersimpan di PostgreSQL; seed tidak menggantikan fitur CRUD |
| NFR-11 | Object storage | File di object storage; database menyimpan metadata/key |
| NFR-12 | Web Push | Web Push nyata dengan Service Worker, VAPID, antrean persisten, dan worker terpisah |
| NFR-13 | Observability | Log terstruktur untuk backend dan worker; error dan job gagal dapat ditelusuri |
| NFR-14 | Code quality | Git, migration files, dokumentasi ERD/arsitektur; TypeScript/ESLint disarankan |
| NFR-15 | Deployment | Aplikasi dan worker dapat dijalankan berdasarkan dokumentasi; Web Push di HTTPS di luar secure context lokal |
| NFR-16 | Kejujuran data | Data belum terkonfirmasi diberi label “Data simulasi” |

### 9.1 Design system yang harus diikuti

| Token | Nilai patokan |
|---|---|
| `--green-900` | `#0F4C3A` |
| `--green-sidebar` | `#14412F` |
| `--gold` | `#C8963E` |
| `--bg-public` | `#F5F5F2` |
| `--bg-dashboard` | `#F4F6F4` |
| `--ink` | `#1F2A26` |
| `--muted` | `#6B7A74` |
| `--success` | `#2E9E5B` |
| `--warning` | `#E0A21B` |
| `--danger` | `#D64545` |
| `--info` | `#2F6FB5` |

Nilai final mengikuti desain Stitch yang disepakati dan didefinisikan satu kali dalam `globals.css`. Font utama Plus Jakarta Sans. Situs publik bernuansa hijau tua/emas; dashboard menggunakan sidebar hijau tua, kartu putih, dan pola komponen konsisten.

## 10. Data simulasi dan seed

### 10.1 Ketentuan umum

- Semua identitas, harga, koordinat, dan listing seed adalah fiktif.
- Data seed untuk cluster dan properti menggunakan `is_demo = true`.
- Kartu dan detail listing demo menampilkan label **“Data simulasi”**; footer publik memberi catatan bahwa data contoh digunakan untuk demonstrasi.
- Label hanya dilepas setelah informasi dikonfirmasi SANG Group dan `is_demo` diubah menjadi `false`.
- Jangan menggunakan logo, foto, denah, atau materi promosi pihak lain tanpa izin.
- Koordinat contoh bukan koordinat unit resmi dan tidak boleh digunakan sebagai bukti batas kavling.

### 10.2 Akun uji yang direncanakan

| Peran | Akun contoh | Status |
|---|---|---|
| Admin | `admin.keyvan@contoh.id` | Aktif |
| Agen | `agen.budi@contoh.id` | Aktif |
| Agen | `agen.siti@contoh.id` | Aktif |
| Agen | `agen.andi@contoh.id` | Aktif |
| Agen tambahan | `agen.baru@contoh.id` | Pending |
| Pembeli | `rina@contoh.id` | Aktif |
| Pembeli | `ahmad@contoh.id` | Aktif |
| Pembeli | `dewi@contoh.id` | Aktif |
| Pembeli lain | Email contoh pada PRD | Variasi aktif/nonaktif |

Kredensial uji disimpan di README lokal atau instruksi demo, bukan hard-coded ke aplikasi. Jangan menggunakan kata sandi demo untuk akun produksi.

### 10.3 Seed cluster, tipe, dan properti

Cluster awal:
- Sang Dipa — Candisari
- Sang Wira — Tembalang
- Sang Naya — Sambiroto

Tipe contoh:
- T36: 36/72
- T45: 45/84
- T60: 60/96
- T72: 72/120

PRD mencantumkan sembilan listing dummy dengan variasi agen, harga, status ketersediaan, status verifikasi, dan koordinat contoh. Seed harus mempertahankan variasi status yang dibutuhkan untuk menguji daftar, filter, verifikasi, pipeline, rekap, dan peta. Data rinci dan tanggal acuan mengikuti tabel pada PRD v4.0 bagian 11.3–11.5.

### 10.4 Minimum data uji

Seed harus mencakup setidaknya:
- 3 cluster;
- 4 tipe properti;
- 9 listing dengan status verifikasi/ketersediaan yang bervariasi;
- 8 pengajuan dengan status yang berbeda;
- akun untuk semua peran, termasuk agen pending dan pembeli nonaktif;
- minimal 5 favorit;
- minimal 5 laporan moderasi;
- minimal 6 berita;
- data fasilitas dan spesifikasi yang cukup untuk menguji halaman publik.

Jika tabel bisnis tambahan diwajibkan dosen untuk memiliki minimal lima baris, isi `cluster_specs` dan `facilities` masing-masing setidaknya lima baris.

---

## 11. Peta halaman dan perlindungan rute

### 11.1 Halaman publik dan autentikasi

| Rute | Akses | Prioritas |
|---|---|---|
| `/` | Publik | W |
| `/products` | Publik | P |
| `/products/[slug]` | Publik | P |
| `/facilities` | Publik | P |
| `/location` | Publik | P |
| `/news` | Publik | P |
| `/news/[slug]` | Publik | O |
| `/contact` | Publik | P |
| `/properti` | Publik | W |
| `/properti/[id]` | Publik | W |
| `/login` | Publik | W |
| `/register` | Publik | W |
| `/pasang-properti` | Publik | W |
| `*` | Semua | O |

### 11.2 Dashboard pembeli

| Rute | Akses |
|---|---|
| `/pembeli` | Pembeli aktif |
| `/pembeli/favorit` | Pembeli aktif |
| `/pembeli/pengajuan` | Pembeli aktif |
| `/pembeli/profil` | Pembeli aktif |

### 11.3 Dashboard agen

| Rute | Akses |
|---|---|
| `/agen` | Agen aktif |
| `/agen/properti` | Agen aktif |
| `/agen/properti/baru` | Agen aktif |
| `/agen/properti/[id]/edit` | Pemilik listing dan agen aktif |
| `/agen/pipeline` | Agen aktif, data dibatasi pada listing miliknya |
| `/agen/masterplan` | Agen aktif, hanya listing miliknya |
| `/agen/pengaturan` | Agen aktif |
| Rute opsional Leads/Tasks/Contacts/Messages/Analytics/Performance/Funnel/Integrations/Help | Agen aktif, bila dibuat |

### 11.4 Dashboard admin

| Rute | Akses |
|---|---|
| `/admin` | Admin |
| `/admin/verifikasi` | Admin |
| `/admin/pengguna` | Admin |
| `/admin/kategori` | Admin |
| `/admin/moderasi` | Admin |
| `/admin/rekap` | Admin |
| `/admin/masterplan` | Admin |
| `/admin/pengaturan` | Admin |

Rute yang tidak berhak diakses harus mengembalikan pengalihan atau halaman 403 yang sesuai. URL detail yang dibuka langsung harus memvalidasi akses server-side.

---

## 12. Skenario pengujian

### 12.1 Alur bisnis end-to-end

| ID | Langkah | Hasil yang diharapkan |
|---|---|---|
| TC-01 | Agen membuat listing, memilih koordinat, unggah foto, kirim verifikasi | Data tersimpan di PostgreSQL; file berada di object storage; status pending |
| TC-02 | Admin menyetujui listing | Status verified dan audit log tersimpan |
| TC-03 | Pengunjung membuka katalog/peta | Listing tampil konsisten dari data database |
| TC-04 | Pembeli mengajukan kunjungan | Pengajuan tersimpan; job push untuk agen masuk antrean setelah transaksi commit |
| TC-05 | Worker memproses antrean | Agen menerima Web Push nyata; klik membuka pengajuan terkait |
| TC-06 | Agen mengubah status pengajuan | Timeline tersimpan dan job push untuk pembeli dibuat |
| TC-07 | Pembeli menerima push | Klik membuka halaman pengajuan; status terbaru terlihat |
| TC-08 | Pengajuan menjadi deal | Status pengajuan dan ketersediaan properti berubah dalam satu transaksi |
| TC-09 | Refresh/logout/login dan buka URL langsung | Data persisten; akses tetap sesuai peran |
| TC-10 | Filter katalog | Daftar dan peta konsisten; pagination server-side |

### 12.2 Validasi tiga lapisan

| ID | Lapisan | Pengujian | Hasil |
|---|---|---|---|
| TC-11 | Frontend | Field kosong, format email/WhatsApp salah, harga negatif, koordinat salah | UI menolak dengan pesan jelas |
| TC-12 | Backend | Kirim request langsung tanpa melewati UI dengan payload tidak valid | Backend menolak |
| TC-13 | Database | Insert/update langsung yang melanggar FK/UNIQUE/CHECK/NOT NULL | Database menolak |
| TC-14 | Ownership | Agen/pembeli mengakses ID milik pengguna lain | Ditolak tanpa membocorkan data |
| TC-15 | Race condition | Dua pengajuan aktif bersamaan untuk pembeli/properti yang sama | Constraint/transaksi menjaga konsistensi |
| TC-16 | Idempotency | Request/event dikirim berulang | Tidak terjadi duplikasi bisnis/notifikasi |

### 12.3 Web Push, worker, dan observability

- Izin notifikasi hanya diminta setelah interaksi pengguna.
- Subscription tersimpan di PostgreSQL dan terkait dengan identitas yang benar.
- Service Worker menangani `push` dan `notificationclick`.
- Worker mengirim notifikasi menggunakan VAPID melalui antrean persisten.
- Simulasikan kegagalan sementara; retry terbatas dan backoff bekerja.
- Subscription tidak valid (404/410) dinonaktifkan/dihapus.
- Kegagalan worker/push tidak membatalkan pengajuan atau perubahan status yang sudah berhasil.
- Job gagal dapat ditemukan melalui log/queue monitoring dan dapat ditangani.
- Worker berjalan terpisah dan dokumentasi menjelaskan cara menjalankan.

### 12.4 Storage, keamanan, migration, deployment

- Migrasi membangun database dari kondisi kosong dan seed berjalan.
- CRUD menggunakan data persisten.
- File salah tipe/terlalu besar ditolak oleh backend; kredensial storage tidak terekspos.
- Secret database, Redis, dan VAPID private key tidak muncul di browser atau repository.
- Rate limiting aktif pada endpoint yang rawan.
- Error backend/worker dicatat tanpa secret atau data sensitif.
- Uji dilakukan pada URL HTTPS deployment serta worker yang berjalan pada platform terpisah.

## 13. Matriks keterlacakan kebutuhan

| Kebutuhan | Bagian SRS | Bukti pengujian |
|---|---|---|
| Kebutuhan bisnis dan perumahan SANG Group | 4, 11 | TC-01–TC-03 |
| Katalog, filter, peta sinkron | 4.1 FR-PUB-07 | TC-03, TC-10 |
| Detail listing dan pengajuan | 4.1 FR-PUB-08 | TC-04, TC-09 |
| Autentikasi dan hak akses | 3, 8 | TC-14 |
| Backend sendiri, tanpa PostgREST sebagai backend | 2, 7, 8 | Pemeriksaan kode dan request langsung |
| PostgreSQL dan ORM/driver | 7 | TC-13, migration |
| Validasi tiga lapisan | 6, 12.2 | TC-11–TC-13 |
| Object storage dan upload aman | 4.5, 8.2 | TC storage |
| Web Push dan Service Worker | 8.3, 12.3 | TC-04–TC-07 |
| Antrean persisten dan worker terpisah | 8.3, 12.3 | Retry, job gagal, worker stop/start |
| Transaksi dan race condition | 5, 7.4 | TC-08, TC-15 |
| Logging dan observability | 8.4, 12.3 | Pemeriksaan log dan job gagal |
| Data simulasi | 10 | TC demo |
| Responsif dan aksesibilitas | 9 | Uji ponsel/keyboard |
| Migration, ERD, dokumentasi | 7, 14 | Setup ulang lingkungan |
| Deployment HTTPS | 2.4, 12.4 | Uji di deployment |


## 14. Kriteria penerimaan

Sistem dapat dianggap memenuhi SRS apabila:

1. Aplikasi Next.js berjalan pada deployment dan terhubung ke PostgreSQL melalui Prisma/Drizzle/`pg` dari backend sendiri.
2. Tidak ada penggunaan PostgREST/Supabase client sebagai pengganti backend untuk query data bisnis.
3. Migration dapat membangun database dari kondisi kosong dan seed hanya digunakan sebagai inisialisasi.
4. Pengguna login dan hanya dapat mengakses fungsi/data sesuai role dan ownership yang diverifikasi server.
5. Agen dapat membuat listing, mengunggah foto ke object storage, menentukan koordinat, dan mengirim listing untuk verifikasi.
6. Admin dapat menyetujui/menolak listing; hanya listing terverifikasi dan tidak tersembunyi yang tampil publik.
7. Pembeli dapat menyimpan favorit, membuat pengajuan, dan melihat status pengajuannya sendiri.
8. Filter katalog dan peta sinkron; detail dapat dibuka melalui URL langsung.
9. Validasi frontend, backend, dan database berjalan secara independen dan sudah didemonstrasikan.
10. Web Push nyata berjalan menggunakan Service Worker dan VAPID, dengan subscription tersimpan di PostgreSQL.
11. Job push diproses oleh worker terpisah melalui antrean persisten; retry dan subscription invalid ditangani.
12. Kegagalan push tidak membatalkan transaksi bisnis.
13. Upload file divalidasi server dan file disimpan di object storage, bukan Base64 di database.
14. Logging backend/worker dapat dipakai menemukan error dan job gagal tanpa membocorkan secret.
15. Semua data demo diberi label “Data simulasi”.
16. CRUD, keamanan, migration, push, dan deployment telah diuji sesuai bagian 12.
17. README, `.env.example`, ERD, dokumentasi arsitektur, konfigurasi VAPID, dan panduan worker tersedia.


## 15. Keputusan dan risiko yang masih terbuka

Hal berikut belum dapat diputuskan hanya dari SRS dan harus mengikuti keputusan tim/pemilik produk:

1. Apakah website hanya demo akademik atau akan digunakan secara komersial.
2. Profil, deskripsi, logo, foto, denah, dan materi resmi SANG Group beserta izin penggunaannya.
3. Harga, stok, tipe, koordinat unit, luas kawasan, fasilitas, legalitas, alamat kantor, dan kontak resmi tiap perumahan.
4. Apakah site plan resmi tersedia dan boleh digunakan.
5. Apakah agen merupakan staf internal atau beberapa agen dengan proses persetujuan.
6. Siapa yang menerima notifikasi pengajuan dan berapa batas waktu tindak lanjut.
7. Apakah label sidebar bahasa Inggris dipertahankan atau diseragamkan menjadi bahasa Indonesia.
8. Apakah halaman Messages dibuat atau diganti tautan WhatsApp.
9. Di mana admin membaca pesan dari `contact_messages`—halaman terpisah atau bagian dari moderasi.
10. Domain dan biaya operasional setelah deployment.

Risiko utama dan mitigasi:
- **Harga/stok tidak mutakhir:** tampilkan `updated_at`, batasi pembaruan pada agen yang bertanggung jawab, dan konfirmasi data awal.
- **Koordinat salah:** admin memeriksa koordinat/alamat sebelum verifikasi; koordinat ganda ditandai untuk moderasi.
- **Materi tidak berizin:** gunakan aset yang disediakan/diizinkan dan simpan bukti izin.
- **Kebocoran data:** aktifkan RLS pada semua tabel dan uji akses lintas peran.
- **Peta lambat di ponsel:** muat peta dinamis, gunakan marker clustering, dan tetap sediakan daftar.
- **Cakupan terlalu besar:** selesaikan alur inti terlebih dahulu; fitur opsional ditunda.
- **Data resmi belum tersedia:** gunakan seed simulasi berlabel, bukan klaim stok nyata.

---

## 16. Catatan kesesuaian dengan PRD v4.0 dan Technical Requirements

SRS ini mempertahankan kebutuhan bisnis, halaman, peran, status listing/pengajuan, desain visual, seed, dan batasan produk dari PRD v3.1/SRS sebelumnya. Perubahan utama mengikuti Technical Requirements terbaru:

- Backend wajib dibuat sendiri dengan Next.js Route Handlers/Server Actions.
- Data bisnis PostgreSQL diakses melalui Prisma, Drizzle, atau `pg`; Supabase/PostgREST tidak boleh menggantikan backend. Supabase tetap boleh menjadi host PostgreSQL dan provider Auth jika query bisnis tetap lewat backend.
- Validasi harus ada pada frontend, backend, dan database serta dapat didemonstrasikan secara independen.
- Migration files, transaksi, constraint, indeks, pagination, dan perlindungan race condition wajib.
- Upload menggunakan object storage, dengan metadata file disimpan di PostgreSQL.
- Web Push nyata wajib melalui Service Worker, VAPID, antrean persisten, dan worker terpisah.
- Retry terbatas, idempotency, invalid subscription handling, serta pemisahan kegagalan push dari transaksi bisnis wajib.
- Logging terstruktur dan observability mencakup backend serta worker.
- Dokumentasi wajib mencakup setup, `.env.example`, migration, ERD, arsitektur, VAPID, worker, dan keterbatasan.

Fitur produk yang tetap dipertahankan meliputi Sang Dipa, Sang Wira, Sang Naya; katalog dan peta GIS; detail properti; favorit dan pengajuan; dashboard pembeli/agen/admin; pipeline; moderasi; rekap; label “Data simulasi”; serta batasan bahwa pembayaran nyata, marketplace multi-developer, integrasi kadaster/BPN, ekspor shapefile, CRM/ERP otomatis, dan chat realtime bukan kebutuhan MVP.

**Aturan pengendali:** jika mockup bertentangan dengan kebutuhan bisnis atau keamanan, ikuti PRD v4.0, SRS v4.0, dan Technical Requirements. Jika ada konflik antar dokumen, klarifikasi kepada pengajar sebelum implementasi dan catat keputusan pada kedua dokumen.
