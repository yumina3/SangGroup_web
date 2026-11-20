# SANG Group — Aplikasi Web Terpadu

Satu aplikasi **Next.js 16 (App Router)** yang menggabungkan:

- **Frontend web-main** — seluruh halaman publik, autentikasi, portal pembeli,
  dashboard agen/penjual, dan admin (UI dipertahankan apa adanya).
- **Backend** — schema Prisma + migrasi + seed, Supabase Auth (SSR), Route
  Handler REST, service layer, RLS, Web Push, dan worker notifikasi.

Semua datadashboard agen (Ringkasan, Properti, Pengajuan, Deals, Pesan, Tugas,
Kontak, Analitik, Kinerja) sekarang berasal dari **data persisten yang sama**:
`profiles`, `properties`, `property_inquiries`, `inquiry_updates`, dan
`notifications`. Tidak ada tabel baru untuk deals/pesan/tugas/kontak —
fitur-fitur tersebut adalah tampilan turunan dari pengajuan dan notifikasi.

---

## 1. Prasyarat

- Node.js 20 LTS atau lebih baru.
- PostgreSQL / Supabase project (Auth + Storage + Database).
- Redis (untuk antrean notifikasi BullMQ). Bisa menjalankan
  `docker compose up -d` memakai `docker-compose.yml` yang disediakan.

## 2. Instalasi

```bash
npm install
cp .env.example .env           # Windows: Copy-Item .env.example .env
```

> **Penting:** gunakan nama file `.env`, bukan hanya `.env.local`. Next.js
> membaca keduanya, tetapi `prisma7.config.ts` memakai `dotenv/config`, dan
> `dotenv` hanya memuat `.env`. Tanpa `.env`, perintah `db:migrate`, `db:seed`,
> dan `db:generate` tidak melihat `DATABASE_URL`.

Isi `.env` (lihat `.env.example` untuk daftar lengkap):

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — untuk seed, admin, dan upload foto |
| `DATABASE_URL` | Connection string Postgres (direct/session pooler) |
| `SUPABASE_STORAGE_BUCKET` | Bucket foto properti (public) |
| `REDIS_URL` | Antrean notifikasi, contoh `redis://localhost:6379` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Web Push. Buat dengan `npx web-push generate-vapid-keys` |
| `LOG_LEVEL` | `trace` … `error` (opsional, default `info`) |

Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY` atau `DATABASE_URL` pada
variabel berprefix `NEXT_PUBLIC_`.

## 3. Migrasi, seed, dan menjalankan aplikasi

```bash
npm run db:generate     # regenerate Prisma Client (juga otomatis saat install)
npm run db:migrate      # prisma migrate deploy
npm run db:seed         # akun uji + proyek, kategori, listing, pengajuan, notifikasi

npm run dev             # terminal 1: aplikasi di http://localhost:3000
npm run worker          # terminal 2: konsumen antrean notifikasi/Web Push
```

Tanpa Redis, aplikasi tetap bisa dibuka, tetapi notifikasi tidak akan dikirim.
Session/DB yang belum dikonfigurasi membuat dashboard memakai data contoh
kosong supaya UI tetap bisa dirender.

### Akun uji (dari `prisma/seed.mts`)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@sanggroup.id` | `admin12345` |
| Agen | `nadia.prameswari@sanggroup.id` | `penjual12345` |
| Pembeli | `rani.hartono@gmail.com` | `pembeli12345` |
| Pembeli | `arif.setyawan@gmail.com` | `pembeli12345` |

Portal login: `/login` (pembeli), `/login-agen`, `/login-admin`.

## 4. Skrip penting

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint |
| `npm test` | Tes validator & transisi status |
| `npm run db:generate` | Generate Prisma Client (`prisma7.config.ts`) |
| `npm run db:migrate` | Deploy migrasi baseline |
| `npm run db:seed` | Seed data demo |
| `npm run db:studio` | Prisma Studio |
| `npm run worker` | Worker BullMQ notifikasi + Web Push |
| `npm run notifications:requeue` | Antrikan ulang notifikasi pending |

## 5. Peta fitur

### Halaman

- **Publik**: beranda, profil proyek (Sang Dipa), katalog properti dengan peta,
  detail properti, favorit, dan form pengajuan.
- **Auth**: registrasi pembeli/agen, login 3 portal, lupa/status akun, logout.
- **Pembeli** (`/dashboard/pembeli`, `/akun`): ringkasan, favorit, jadwal,
  status pengajuan, notifikasi Web Push.
- **Agen** (`/dashboard/penjual`): ringkasan, properti (+ form/ubah),
  pengajuan, deals, pesan, tugas, kontak, analitik, kinerja, pengaturan,
  bantuan.
- **Admin** (`/admin`): verifikasi listing, persetujuan agen, kategori,
  proyek, pengguna, dan rekap.

### API & data

- Route Handler ada di `src/app/api/**` (properties, projects, categories,
  inquiries, favorites, notifications, push, agent, admin, auth).
- Autentikasi memakai `@supabase/ssr` dengan cookie; role aplikasi dibaca dari
  tabel `profiles` (bukan dari metadata yang bisa diubah pengguna).
- Akses lintas akun dicegah di service layer dan kebijakan RLS Supabase.
- `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/ERD.md`, dan `docs/DEMO.md`
  berisi kontrak endpoint, arsitektur, model data, dan skenario verifikasi
  (termasuk uji IDOR/RLS).

## 6. Verifikasi cepat

```bash
npm test
npm run lint
npm run build
```

Lalu ikuti `docs/DEMO.md`: registrasi → verifikasi admin → katalog →
pengajuan pembeli → notifikasi → tindak lanjut agen, dan uji akses tidak sah
pada bagian akhir dokumen.

## 7. Catatan penggabungan

- Basis proyek adalah `SangGroup_web-main`; file backend disalin ke dalamnya.
- Untuk file yang sama di kedua proyek, **versi web-main yang dipakai**.
- `src/lib/dashboard/*` bertindak sebagai adapter: data DB diubah ke bentuk
  yang diharapkan komponen UI lama (mis. status `PENDING/VERIFIED/AVAILABLE`).
- `src/proxy.js` menyegarkan sesi Supabase pada setiap permintaan.
