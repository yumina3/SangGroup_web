# API Reference (SRS)

Base URL: `http://localhost:3000`. Autentikasi memakai cookie sesi Supabase.

Respons sukses: `{ "data": ... }`. Error:
`{ "error": { "code", "message", "fieldErrors?" } }`.

Kode: `400` JSON rusak, `401` belum login, `403` peran/kepemilikan, `404`,
`409` konflik status/duplikat, `422` validasi, `429` rate limit, `503` layanan
belum dikonfigurasi.

## Publik

| Metode | Path | Fungsi |
|---|---|---|
| GET | `/api/health` | Status DB/Auth/Storage/Queue/Push |
| GET | `/api/projects` | Daftar proyek aktif + jumlah listing approved |
| GET | `/api/projects/:slug` | Detail proyek |
| GET | `/api/categories` | Kategori aktif |
| GET | `/api/properties` | Katalog listing approved + filter |
| GET | `/api/properties/:slug` | Detail listing approved |

Filter katalog: `q`, `project`, `category`, `status`, `minPrice`, `maxPrice`,
`minLand`, `maxLand`, `minBuilding`, `maxBuilding`, `page`, `pageSize`.

Contoh:

```bash
curl "http://localhost:3000/api/properties?project=sang-dipa&minPrice=500000000&maxPrice=1000000000"
```

## Autentikasi

| Metode | Path | Body |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | — |
| GET | `/api/auth/session` | — |
| POST | `/api/auth/register/buyer` | `{ fullName, email, phone, password, confirmPassword }` |

Registrasi hanya membuat akun **buyer**; peran lain dibuat admin.

## Favorit (pembeli)

| Metode | Path | Body/Query |
|---|---|---|
| GET | `/api/favorites` | — |
| POST | `/api/favorites` | `{ propertyId }` |
| DELETE | `/api/favorites?propertyId=…` | — |

## Pengajuan

| Metode | Path | Akses | Body |
|---|---|---|---|
| GET | `/api/inquiries` | pembeli/agen/admin | filter `status` |
| POST | `/api/inquiries` | pembeli | `{ propertyId, inquiryType, message? }` |
| GET | `/api/inquiries/:id` | pihak terkait | — |
| PATCH | `/api/inquiries/:id` | agen/admin | `{ status, note? }` |
| POST | `/api/inquiries/:id/cancel` | pembeli | `{ reason? }` |

`inquiryType`: `kunjungan` | `minat_beli`.
`status` tujuan agen: `dihubungi`, `kunjungan_dijadwalkan`, `selesai`, `ditolak`.

Contoh:

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/inquiries \
  -H "content-type: application/json" \
  -d '{"propertyId":"<uuid>","inquiryType":"kunjungan","message":"Ingin survei akhir pekan."}'
```

## Agen

| Metode | Path | Fungsi |
|---|---|---|
| GET/POST | `/api/agent/properties` | Daftar / buat listing (pending) |
| GET/PATCH/DELETE | `/api/agent/properties/:id` | Detail / ubah / hapus |
| POST | `/api/agent/properties/:id/resubmit` | Kirim ulang setelah ditolak |
| PATCH | `/api/agent/properties/:id/business-status` | `{ businessStatus }` |
| GET/POST | `/api/agent/properties/:id/images` | Daftar / unggah foto (multipart `file`) |
| DELETE/PATCH | `/api/agent/properties/:id/images/:imageId` | Hapus / jadikan utama |
| GET | `/api/agent/inquiries` | Pengajuan listing milik agen |
| PATCH | `/api/agent/inquiries/:id` | Tindak lanjut |

Body listing:

```json
{
  "projectId": "<uuid>",
  "categoryId": "<uuid>",
  "title": "Rumah Tipe 45 — Sang Dipa",
  "description": "Unit contoh.",
  "price": 750000000,
  "landArea": 84,
  "buildingArea": 45,
  "bedrooms": 3,
  "bathrooms": 2,
  "address": "Jl. Ngesrep Timur V No. 25, Semarang",
  "latitude": -7.0535,
  "longitude": 110.438
}
```

`latitude`/`longitude` boleh `null` (keduanya), tidak boleh hanya salah satu.

Upload foto:

```bash
curl -b cookies.txt -X POST \
  -F "file=@foto.jpg" -F "altText=Tampak depan" \
  http://localhost:3000/api/agent/properties/<id>/images
```

## Admin

| Metode | Path | Fungsi |
|---|---|---|
| GET | `/api/admin/properties` | Filter `verificationStatus`, `projectId`, `ownerId`, `businessStatus` |
| POST | `/api/admin/properties/:id/verify` | `{ decision: "approved"\|"rejected", note? }` |
| GET/POST | `/api/admin/categories` | Daftar / buat kategori |
| PATCH | `/api/admin/categories/:id` | Ubah kategori |
| GET/POST | `/api/admin/projects` | Daftar / buat proyek |
| PATCH | `/api/admin/projects/:id` | Ubah proyek |
| GET/POST | `/api/admin/users` | Daftar / buat akun staf (`role: agent\|admin`) |
| PATCH | `/api/admin/users/:id` | `{ role?, isActive? }` |
| GET | `/api/admin/recap` | Rekap listing/pengajuan/pengguna |

## Notifikasi & Web Push

| Metode | Path | Fungsi |
|---|---|---|
| GET | `/api/notifications?unread=1` | Daftar notifikasi |
| PATCH | `/api/notifications` | Tandai semua dibaca |
| PATCH | `/api/notifications/:id` | Tandai satu dibaca |
| GET | `/api/push/public-key` | Kunci publik VAPID |
| POST/DELETE | `/api/push/subscriptions` | Simpan/cabut subscription |
| POST | `/api/push/test` | Kirim notifikasi uji |
