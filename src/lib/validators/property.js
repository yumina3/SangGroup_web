import { z } from "zod";

/**
 * Skema form properti penjual (SRS-F-SEL-03, SEL-04).
 *
 * Dipakai klien untuk pesan error per field sekarang, dan nanti dipakai ulang
 * di Server Action sebagai sumber kebenaran (SRS-N-MNT-01). Constraint
 * database (CHECK harga > 0, rentang lat/lng) adalah lapisan ketiganya.
 *
 * Semua nilai masuk sebagai string dari <input>, lalu dikonversi.
 */

const requiredText = (label, min, max) =>
  z
    .string()
    .trim()
    .min(min, { error: `${label} wajib diisi` })
    .max(max, { error: `${label} maksimal ${max} karakter` });

/** Kategori listing yang boleh dipilih penjual (sama dengan isian form). */
export const PROPERTY_CATEGORIES = ["Rumah", "Ruko", "Kavling", "Apartemen"];

const numeric = (label, { min, max, integer = true }) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} wajib diisi` })
    .refine((value) => /^-?\d+(\.\d+)?$/.test(value), {
      error: `${label} harus berupa angka`,
    })
    .transform(Number)
    .refine((value) => Number.isFinite(value), { error: `${label} tidak valid` })
    .refine((value) => !integer || Number.isInteger(value), {
      error: `${label} harus bilangan bulat`,
    })
    .refine((value) => value >= min, { error: `${label} minimal ${min}` })
    .refine((value) => value <= max, { error: `${label} maksimal ${max}` });

export const propertyFormSchema = z.object({
  title: requiredText("Nama properti", 5, 120),
  category: z.enum(PROPERTY_CATEGORIES, { error: "Pilih kategori yang tersedia" }),
  cluster: requiredText("Perumahan / cluster", 2, 80),
  unit: requiredText("Nomor kavling / unit", 1, 30),
  description: z
    .string()
    .trim()
    .max(1000, { error: "Deskripsi maksimal 1000 karakter" }),
  price: numeric("Harga", { min: 1, max: 1_000_000_000_000 }),
  landArea: numeric("Luas tanah", { min: 1, max: 100_000 }),
  buildingArea: numeric("Luas bangunan", { min: 1, max: 100_000 }),
  bedrooms: numeric("Kamar tidur", { min: 0, max: 20 }),
  bathrooms: numeric("Kamar mandi", { min: 0, max: 20 }),
  floors: numeric("Jumlah lantai", { min: 1, max: 5 }),
  address: requiredText("Alamat lengkap", 6, 250),
  city: requiredText("Kota / kabupaten", 2, 80),
  latitude: numeric("Latitude", { min: -90, max: 90, integer: false }),
  longitude: numeric("Longitude", { min: -180, max: 180, integer: false }),
});

/**
 * Validasi tambahan di luar skema:
 * - harga harus > 0 dan ≤ Rp50 miliar (batas wajar listing perumahan, juga
 *   menjaga angka rupiah tetap aman untuk perhitungan summary);
 * - koordinat 0,0 ditolak karena berarti titik peta belum dipilih.
 */
const MAX_PRICE = 50_000_000_000;

export function validatePropertyForm(raw, { submission = "PENDING" } = {}) {
  const parsed = propertyFormSchema.safeParse(raw);
  /** @type {Record<string,string>} */
  const fieldErrors = {};

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path?.[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
  }

  const price = Number(raw.price);
  if (!fieldErrors.price && (!Number.isFinite(price) || price <= 0)) {
    fieldErrors.price = "Harga harus lebih besar dari 0";
  } else if (!fieldErrors.price && price > MAX_PRICE) {
    fieldErrors.price = "Harga maksimal Rp50.000.000.000";
  }

  if (
    !fieldErrors.latitude &&
    !fieldErrors.longitude &&
    Number(raw.latitude) === 0 &&
    Number(raw.longitude) === 0
  ) {
    fieldErrors.latitude = "Tentukan titik lokasi di peta atau isi koordinat";
  }

  if (raw.description && raw.description.trim().length > 0 && raw.description.trim().length < 20) {
    fieldErrors.description = "Deskripsi minimal 20 karakter bila diisi";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: { ...parsed.data, submission },
  };
}

/** Field yang mengembalikan listing VERIFIED ke PENDING (SRS-F-SEL-08). */
export const KEY_FIELDS = ["price", "latitude", "longitude", "address"];

/** Field kunci mana saja yang berubah dibanding properti tersimpan. */
export function changedKeyFields(property, form) {
  if (!property) return [];
  return KEY_FIELDS.filter((key) => String(property?.[key] ?? "") !== String(form?.[key] ?? ""));
}

/**
 * Aturan per status listing (SRS-F-SEL-03 s.d. SEL-08):
 * - DRAFT     : boleh disimpan sebagai draft atau dikirim untuk verifikasi.
 * - REJECTED  : perbaiki data lalu kirim ulang untuk verifikasi.
 * - PENDING   : admin sedang memeriksa; edit dikunci agar antrean tidak berubah.
 * - VERIFIED  : boleh diubah; perubahan field kunci mengirim ulang ke verifikasi.
 * - HIDDEN    : hanya bisa dikirim untuk verifikasi ulang.
 */
export const EDITABLE_LISTING_STATUSES = ["DRAFT", "REJECTED", "VERIFIED", "HIDDEN"];

export function submissionOptions(listingStatus) {
  const status = listingStatus ?? "DRAFT";
  return {
    draft: status === "DRAFT",
    verify: EDITABLE_LISTING_STATUSES.includes(status),
    locked: status === "PENDING",
  };
}
