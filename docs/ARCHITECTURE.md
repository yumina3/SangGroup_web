# Arsitektur Backend (SRS/PRD)

## 1. Lapisan

```
Browser (Server Component / Server Action / fetch)
        │
        ▼
Route Handler / Server Action      ← validasi Zod, sesi Supabase
        │
        ▼
Service layer (src/lib/services)   ← aturan bisnis + otorisasi + transaksi
        │
        ├─► Prisma (role Postgres) ──► Supabase Postgres
        ├─► Supabase Storage ────────► foto properti
        └─► notifications (outbox) ──► BullMQ ──► worker ──► Web Push
```

- Peran tidak pernah dipercaya dari klien; `requireApiUser`/`requirePageUser`
  membaca Supabase Auth + tabel `profiles`.
- Setiap service memeriksa kepemilikan (listing agen, pengajuan pembeli/agen).
- Constraint & trigger database adalah lapisan ketiga.

## 2. Autentikasi (Supabase Auth)

- Klien: `@supabase/ssr` (`createServerClient`) membaca/menulis cookie sesi.
- `proxy.js` menyegarkan token pada setiap request.
- Registrasi pembeli memanggil `supabase.auth.signUp` dengan metadata
  `full_name`/`phone`. Trigger `handle_new_user` membuat baris `profiles`
  dengan role `buyer`.
- Akun agen/admin dibuat lewat Supabase Admin API (`POST /api/admin/users`)
  atau seed; role ditulis ke `profiles`.
- `protect_profile_fields` (trigger) menolak perubahan `role`/`is_active`
  kecuali dari role Postgres/service atau admin.
- Akun `is_active = false` langsung di-sign-out.

## 3. Skema data (SRS §7)

| Tabel | Isi |
|---|---|
| `profiles` | id = auth.users.id, full_name, phone, role, is_active |
| `projects` | 3 proyek (Sang Dipa/Wira/Naya) + slug, koordinat |
| `property_categories` | kategori/tipe dikelola admin |
| `properties` | project_id, owner_id, category_id, slug unik, harga/luas, koordinat opsional, status verifikasi & bisnis |
| `property_images` | storage_path, alt_text, sort_order, is_primary |
| `favorites` | unique (buyer_id, property_id) |
| `property_inquiries` | jenis, pesan, status, buyer, property |
| `inquiry_updates` | riwayat transisi status + catatan |
| `site_plans` | opsional, `approved_for_use` |
| `push_subscriptions`, `notifications` | Web Push + outbox |

Status:
- verifikasi: `pending → approved | rejected`
- bisnis: `tersedia ↔ dipesan → terjual` (terjual final, trigger)
- pengajuan: `menunggu → dihubungi | kunjungan_dijadwalkan | ditolak | dibatalkan`,
  lalu `selesai`; status final tidak bisa dibuka (trigger).

## 4. Aturan properti

- Listing baru selalu `pending` (BR-19) dan tidak muncul di katalog.
- Admin menyetujui/menolak; penolakan wajib catatan (BR-20).
- Agen hanya bisa mengubah listing miliknya (FR-37).
- Perubahan field kunci (`price`, `latitude/longitude`, `projectId`,
  `categoryId`, `address`) atau foto pada listing `approved` mengembalikan ke
  `pending` (BR-22).
- Hapus listing hanya `pending`/`rejected` tanpa pengajuan.
- Koordinat boleh null; katalog tidak membuat marker untuk koordinat kosong
  (FR-12).

## 5. Favorit & pengajuan

- Favorit: upsert unik pembeli+listing (FR-26).
- Pengajuan: properti harus `approved` dan belum `terjual`; partial unique index
  mencegah dua pengajuan aktif untuk kombinas yang sama (FR-30).
- Transisi status divalidasi service + trigger; setiap perubahan menulis
  `inquiry_updates` dan notifikasi ke pembeli.
- Pembeli hanya bisa membatalkan; agen hanya untuk listing miliknya; admin
  melihat semua (VL-18).

## 6. RLS

Semua tabel mengaktifkan RLS dengan policy:

- publik: `projects`/`categories` aktif, `properties` approved, `property_images`
  milik listing approved, `site_plans` yang disetujui;
- pembeli: favorit & pengajuan miliknya;
- agen: listing/pengajuan miliknya;
- admin: semua (fungsi `is_admin()` security definer).

Prisma terhubung sebagai role Postgres sehingga bypass RLS; RLS melindungi
akses langsung memakai anon key + JWT (Supabase REST/JS). Uji di `docs/DEMO.md`.

## 7. Storage

- Bucket `property-images` (public) untuk foto katalog.
- Upload lewat server (`multipart/form-data`) lalu Supabase Storage; tipe
  JPG/PNG/WEBP, ≤ 5 MB, maksimal 8 foto/listing.
- Tabel hanya menyimpan `storage_path`; URL publik dibentuk saat serialisasi.
- Hapus foto menghapus objek storage + baris DB.

## 8. Web Push

Sama seperti sebelumnya: outbox `notifications` ditulis dalam transaksi bisnis,
setelah commit di-enqueue ke BullMQ; worker mengirim Web Push, mencabut
subscription 404/410, retry backoff, sweep PENDING tiap 60 detik.

## 9. Keputusan teknis

| Keputusan | Alasan |
|---|---|
| Supabase Auth | Wajib SRS (BR-03/FR-20), profil otomatis via trigger |
| Prisma + role Postgres | Percepat pengembangan; RLS tetap ada untuk akses langsung |
| Migrasi SQL manual | Constraint/trigger/RLS tidak bisa diekspresikan Prisma |
| Zod di service + handler | Validasi backend independen dari UI |
| Public bucket | Foto katalog memang publik (FR-47); berkas privat tidak disajikan |

## 10. Struktur folder

```
prisma/
  schema.prisma              model SRS
  migrations/…_srs_baseline  tabel + constraint + trigger + RLS
  seed.mts                   akun Auth + data demo
src/
  app/api/                   Route Handlers (publik, agen, admin, auth, push)
  app/(auth)/                registrasi pembeli, info akun agen
  app/penjual/               login/logout Supabase
  app/dashboard/penjual/     UI agen (sementara, adapter)
  app/admin/                 verifikasi + rekap
  app/akun/                  favorit + pengajuan pembeli
  lib/supabase/              server/browser/admin client
  lib/services/              properti, proyek, kategori, favorit, pengajuan, admin
  lib/storage/               Supabase Storage
  lib/validators/            skema Zod
  lib/domain/                matriks status (murni, diuji)
worker/index.mts             worker Web Push
```
