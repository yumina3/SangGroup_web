# Skenario Demonstrasi & Verifikasi (SRS §9)

Prasyarat: `.env` terisi (Supabase URL, anon, service role, DATABASE_URL,
Redis, VAPID), migrasi + seed sudah jalan, `npm run dev` dan `npm run worker`
aktif.

Akun demo: `admin@sanggroup.id/admin12345`,
`nadia.prameswari@sanggroup.id/penjual12345`,
`rani.hartono@gmail.com/pembeli12345`, `arif.setyawan@gmail.com/pembeli12345`.

---

## Skenario 1 — Menelusuri proyek dan properti

1. `GET /api/projects` → 3 proyek aktif.
2. `GET /api/properties` → hanya listing `approved`.
3. Filter: `GET /api/properties?project=sang-dipa&minPrice=500000000&maxPrice=1000000000`.
4. `GET /api/properties/rumah-tipe-36-sang-dipa` → detail + `primaryImageUrl`.
5. Listing `pending`/`rejected` (mis. `rumah-tipe-72-sang-dipa`) → `404`.

Hasil: katalog hanya approved; listing tanpa koordinat menghasilkan
`latitude: null` (tidak ada marker palsu).

## Skenario 2 — Favorit dan pengajuan pembeli

```bash
# login pembeli, simpan cookie
curl -c rani.txt -X POST http://localhost:3000/api/auth/login \
  -H "content-type: application/json" \
  -d '{"email":"rani.hartono@gmail.com","password":"pembeli12345"}'

# favorit
curl -b rani.txt -X POST http://localhost:3000/api/favorites \
  -H "content-type: application/json" -d '{"propertyId":"<uuid-approved>"}'

# pengajuan
curl -b rani.txt -X POST http://localhost:3000/api/inquiries \
  -H "content-type: application/json" \
  -d '{"propertyId":"<uuid-approved>","inquiryType":"kunjungan","message":"Ingin survei."}'
```

Lalu buka `/akun`: favorit dan pengajuan tampil (data dari Supabase).
Kirim pengajuan aktif kedua untuk properti yang sama → `409` (FR-30).

Agen menindaklanjuti:

```bash
curl -b nadia.txt -X PATCH http://localhost:3000/api/agent/inquiries/<id> \
  -H "content-type: application/json" \
  -d '{"status":"dihubungi","note":"Sudah dihubungi via WhatsApp."}'
```

Pembeli membuka `/akun` lagi → status berubah (BH-22).

## Skenario 3 — Listing dan verifikasi

1. Login agen, buka `/dashboard/penjual/properti/baru`.
2. Isi form, simpan → listing `pending`, tidak muncul di `GET /api/properties`.
3. Upload foto di halaman ubah (JPG/PNG/WEBP ≤ 5 MB).
4. Login admin, buka `/admin`, setujui listing.
5. `GET /api/properties` sekarang memuat listing tersebut.
6. Ubah harga di halaman ubah → status kembali `pending` (BR-22).
7. Ubah status unit ke `dipesan`/`terjual` → katalog menampilkan label baru.

Bukti database:

```sql
select verification_status, business_status, count(*)
from properties group by 1,2 order by 1,2;
```

## Skenario 4 — Akses tidak sah (server + RLS)

**Server:**

```bash
curl -i http://localhost:3000/api/agent/properties                 # 401
curl -b rani.txt -i http://localhost:3000/api/admin/properties     # 403
curl -b rani.txt -i http://localhost:3000/api/inquiries/<id-milik-orang-lain>  # 404
```

**RLS (Supabase REST memakai JWT pengguna):**

```bash
# 1. ambil access token pembeli
TOKEN=$(curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "content-type: application/json" \
  -d '{"email":"arif.setyawan@gmail.com","password":"pembeli12345"}' | jq -r .access_token)

# 2. arif hanya melihat pengajuan miliknya sendiri
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/property_inquiries?select=buyer_id,status" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $TOKEN"
```

Harapan: hanya baris dengan `buyer_id` milik Arif. Mencoba `PATCH` baris
pengajuan milik Rani → 0 baris terpengaruh/403.

Uji role: pembeli mencoba `PATCH /rest/v1/profiles?id=eq.<dirinya>` dengan
`{"role":"admin"}` → ditolak trigger `protect_profile_fields`.

## Skenario 5 — Input tidak valid

```bash
# harga negatif
curl -b nadia.txt -X POST http://localhost:3000/api/agent/properties \
  -H "content-type: application/json" -d '{"projectId":"<uuid>","categoryId":"<uuid>",
  "title":"Uji","price":-1,"landArea":84,"buildingArea":45,"address":"Jl. Uji No. 1"}'
# 422 fieldErrors.price

# latitude di luar rentang
... "latitude": -91 ...

# file terlarang
curl -b nadia.txt -X POST -F "file=@dokumen.pdf" \
  http://localhost:3000/api/agent/properties/<id>/images
# 422 "Foto harus berformat JPG, PNG, atau WEBP."
```

Constraint database (jalankan di SQL Editor Supabase):

```sql
insert into properties (project_id, owner_id, category_id, slug, title, price,
  land_area, building_area, address, updated_at)
values ('<project>','<agent>','<category>','uji-sql','Uji',-1,10,10,'Jl. Uji',now());
-- ERROR check constraint properties_price_non_negative
```

## Skenario 6 — Peta dan deployment

- `GET /api/properties` mengembalikan `latitude`/`longitude` hanya dari database.
- Listing dengan koordinat `null` tidak boleh dibuatkan marker (FR-12).
- Filter katalog dan data marker memakai endpoint yang sama (FR-11).
- Deploy Vercel: set env yang sama; Supabase Auth/Storage/DB sudah hosted,
  jadi tidak ada ketergantungan server lokal. Worker dapat dijalankan di
  Railway/Fly/VPS atau `npm run worker` di mesin terpisah.

## Web Push

1. Login agen → `/dashboard/penjual/pengaturan?tab=notifikasi`.
2. **Aktifkan notifikasi** → izinkan browser → **Kirim notifikasi uji**.
3. Notifikasi sistem muncul; klik membuka `/akun` (sesuai payload).
4. Kejadian bisnis: pembeli mengirim pengajuan → notifikasi ke agen;
   agen mengubah status → notifikasi ke pembeli.

Bukti:

```sql
select type, status, attempts, sent_at from notifications order by created_at desc limit 5;
select endpoint, last_success_at, revoked_at from push_subscriptions;
```

Worker mencatat `worker.sent`; Redis mati → baris tetap `pending` lalu disapu
worker ≤ 60 detik atau lewat `npm run notifications:requeue`.

## Bukti minimal

| Butir SRS | Cara |
|---|---|
| FR-06–19 | Skenario 1 |
| FR-25–30 | Skenario 2 |
| FR-31–39 | Skenario 3 |
| NF-08 / BR-07 | Skenario 4 (server + RLS) |
| VL-01…VL-23 | Skenario 5 |
| BR-02/BR-08 | Deploy Vercel + Supabase |
| §8 | `npm run db:seed` (6 listing, 5 pengajuan) |
