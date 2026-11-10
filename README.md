# SANG Group — Website Sistem Informasi Jual Beli Perumahan (GIS)

Implementasi backend + sebagian UI untuk tugas UAS, mengikuti **SRS.md** dan
**PRD.md**:

- Next.js 16 (App Router) + JavaScript
- **Supabase**: Postgres, **Supabase Auth**, Supabase Storage
- Prisma sebagai lapisan akses data server
- RLS pada semua tabel bisnis
- Web Push + background worker (kebutuhan Technical Requirements)

Dokumen acuan: [`SRS.md`](../SRS.md) dan [`PRD.md`](../PRD.md). Ringkasan
arsitektur ada di [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), daftar
endpoint di [`docs/API.md`](docs/API.md), skenario uji di
[`docs/DEMO.md`](docs/DEMO.md), dan ERD di [`docs/ERD.md`](docs/ERD.md).

## Kesesuaian dengan SRS

| Ketentuan | Implementasi |
|---|---|
| BR-03 / FR-20 | Login & registrasi memakai Supabase Auth (cookie via `@supabase/ssr`) |
| FR-21 | Trigger `handle_new_user` membuat `profiles.id = auth.users.id` |
| FR-22 / FR-41 | Role hanya diubah admin; trigger `protect_profile_fields` menolak perubahan dari klien |
| §7 | Tabel `projects`, `property_categories`, `properties(slug)`, `property_images`, `favorites`, `property_inquiries`, `inquiry_updates`, `site_plans` |
| BR-19 | Listing baru selalu `pending`; katalog publik hanya `approved` |
| BR-22 | Perubahan harga/koordinat/proyek/kategori/alamat/foto pada listing approved mengembalikan ke `pending` |
| FR-25–26 | Favorit dengan unique `(buyer_id, property_id)` |
| FR-27–30 | Pengajuan dengan unique parsial satu pengajuan aktif per pembeli+listing |
| §7 status | `tersedia/dipesan/terjual`, `pending/approved/rejected`, `menunggu/dihubungi/kunjungan_dijadwalkan/selesai/dibatalkan/ditolak` |
| BR-07 / NF-08 | RLS aktif di semua tabel + pemeriksaan otorisasi di service layer |
| BR-05 | Foto di Supabase Storage; tabel hanya menyimpan `storage_path` |
| FR-42–43 | Rekap admin dihitung dengan `groupBy` dari database |
| §8 | Seed: 6 listing (approved/pending/rejected; tersedia/dipesan/terjual) + 5 pengajuan variasi status |

## Prasyarat

- Node.js 22+ (diuji Node 24)
- Proyek **Supabase** (Postgres + Auth + Storage)
- Redis (untuk Web Push; aplikasi tetap jalan tanpa Redis, notifikasi tertahan `pending`)

## Setup Supabase

1. **Database** — Project Settings → Database → Connection string.
   Salin **Direct connection** atau **Session pooler** ke `DATABASE_URL`
   (wajib `?sslmode=require`).

2. **Auth** — Authentication → Providers → Email aktif.
   Untuk demo, matikan **Confirm email** agar registrasi langsung mendapat sesi.
   (Jika dibiarkan aktif, UI menampilkan instruksi cek email.)

3. **Storage** — Storage → New bucket `property-images`, set **Public**.
   Foto katalog dibaca lewat public URL; berkas privat tidak disajikan.

4. **Kunci API** — Project Settings → API:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan
   `SUPABASE_SERVICE_ROLE_KEY` (hanya server; jangan pernah pakai prefix `NEXT_PUBLIC_`).

5. Salin `.env.example` → `.env` dan isi nilainya, termasuk Redis + VAPID.

## Menjalankan

```bash
npm install
npm run db:generate
npm run db:migrate      # prisma migrate deploy (baseline SRS + RLS)
npm run db:seed         # akun Auth + 3 proyek + 6 listing + 5 pengajuan
npm run dev
```

Terminal kedua untuk worker notifikasi:

```bash
npm run worker
```

Buka `http://localhost:3000`.

## Akun demo (dibuat seed)

| Peran | Email | Kata sandi | Halaman |
|---|---|---|---|
| Admin | `admin@sanggroup.id` | `admin12345` | `/admin` |
| Agen | `nadia.prameswari@sanggroup.id` | `penjual12345` | `/dashboard/penjual` |
| Pembeli | `rani.hartono@gmail.com` | `pembeli12345` | `/akun` |
| Pembeli | `arif.setyawan@gmail.com` | `pembeli12345` | `/akun` |

Registrasi publik hanya untuk pembeli (`/register`). Akun agen/admin dibuat
admin (FR-22) — sementara lewat seed atau `POST /api/admin/users`.

## Peta route

| Route | Akses | Keterangan |
|---|---|---|
| `/` , `/sang-dipa`, dst. | publik | Situs marketing yang sudah ada |
| `/register` | publik | Registrasi pembeli (Supabase Auth) |
| `/penjual` | publik | Login agen/admin |
| `/dashboard/penjual` | agen | Ringkasan listing & pengajuan |
| `/dashboard/penjual/properti` | agen | CRUD listing + upload foto |
| `/dashboard/penjual/pengajuan` | agen | Tindak lanjut pengajuan |
| `/dashboard/penjual/pengaturan` | agen | Profil, kata sandi, Web Push |
| `/admin` | admin | Rekap + verifikasi listing |
| `/akun` | pembeli | Favorit, pengajuan, notifikasi |
| `/api/*` | sesuai peran | Lihat `docs/API.md` |

> Halaman katalog publik (`/properti`, `/properti/[slug]`, `/proyek/*`) dan
> dashboard pembeli/agen versi SRS masih dikerjakan pada tahap frontend
> berikutnya; API-nya sudah tersedia. Dashboard agen saat ini memakai adapter
> data agar UI lama tetap berjalan.

## Web Push

1. `npx web-push generate-vapid-keys`, isi `NEXT_PUBLIC_VAPID_PUBLIC_KEY`,
   `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.
2. Jalankan Redis + `npm run worker`.
3. Login → Pengaturan → Notifikasi → **Aktifkan notifikasi** → **Kirim uji**.
4. Kejadian bisnis: pengajuan baru (notifikasi ke agen), perubahan status
   pengajuan (notifikasi ke pembeli), hasil verifikasi listing (ke agen).

Alur: transaksi bisnis → baris `notifications` (pending) → BullMQ → worker →
Web Push → service worker.

## RLS: bagaimana diuji

Backend memakai Prisma dengan role Postgres (bypass RLS) dan tetap memeriksa
kepemilikan di service. RLS menjadi lapisan kedua untuk akses langsung memakai
anon key + JWT pengguna (Supabase REST/JS). Cara mengujinya ada di
`docs/DEMO.md` (skenario 4).

## Skrip

| Skrip | Fungsi |
|---|---|
| `npm run dev` | Aplikasi Next.js |
| `npm run build` / `start` | Build & produksi |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Terapkan migrasi (baseline + RLS) |
| `npm run db:seed` | Akun Auth + data demo SRS |
| `npm run worker` | Worker Web Push |
| `npm run notifications:requeue` | Masukkan ulang notifikasi pending |
| `npm test` | Tes validasi & matriks transisi |

## Keterbatasan

- Halaman katalog/proyek/detail SRS belum dibuat; API sudah siap.
- Dashboard agen masih memakai adapter status lama (teks Indonesia) sampai
  halaman SRS selesai.
- Admin UI baru mencakup verifikasi + rekap; CRUD kategori/proyek/pengguna
  tersedia lewat API (`/api/admin/*`).
- RLS tidak membatasi Prisma (role privileged); lihat catatan di atas.
- Rate limit login memakai memori proses (satu instance).
