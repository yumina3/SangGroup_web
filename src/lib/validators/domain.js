import { z } from "zod";

/**
 * Skema validasi domain (lapisan backend) sesuai SRS §4.
 * Constraint database pada migrasi baseline adalah lapisan ketiga.
 */

export const BUSINESS_STATUSES = ["tersedia", "dipesan", "terjual"];
export const VERIFICATION_STATUSES = ["pending", "approved", "rejected"];
export const INQUIRY_TYPES = ["kunjungan", "minat_beli"];
export const INQUIRY_STATUSES = [
  "menunggu",
  "dihubungi",
  "kunjungan_dijadwalkan",
  "selesai",
  "dibatalkan",
  "ditolak",
];
export const USER_ROLES = ["buyer", "agent", "admin"];

const text = (label, min, max) =>
  z
    .string()
    .trim()
    .min(min, { error: `${label} minimal ${min} karakter` })
    .max(max, { error: `${label} maksimal ${max} karakter` });

const wholeNumber = (label, min, max) =>
  z.coerce
    .number({ error: `${label} harus berupa angka` })
    .int({ error: `${label} harus bilangan bulat` })
    .min(min, { error: `${label} minimal ${min}` })
    .max(max, { error: `${label} maksimal ${max}` });

/** Koordinat opsional; null berarti listing tanpa marker (FR-12). */
const coordinate = (label, min, max) =>
  z
    .union([
      z.coerce.number({ error: `${label} harus berupa angka` }).min(min).max(max),
      z.null(),
    ])
    .optional();

const slugField = z
  .string()
  .trim()
  .min(2, { error: "Slug minimal 2 karakter" })
  .max(80, { error: "Slug maksimal 80 karakter" })
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    error: "Slug hanya huruf kecil, angka, dan tanda hubung",
  });

// --- Properti -----------------------------------------------------------

const propertyFields = {
  projectId: z.string().uuid({ error: "Pilih proyek" }),
  categoryId: z.string().uuid({ error: "Pilih kategori" }),
  title: text("Nama listing", 3, 160),
  description: z
    .string()
    .trim()
    .max(5000, { error: "Deskripsi maksimal 5000 karakter" })
    .default(""),
  price: wholeNumber("Harga", 0, 500_000_000_000),
  landArea: wholeNumber("Luas tanah", 1, 1_000_000),
  buildingArea: wholeNumber("Luas bangunan", 1, 1_000_000),
  bedrooms: wholeNumber("Kamar tidur", 0, 20).default(0),
  bathrooms: wholeNumber("Kamar mandi", 0, 20).default(0),
  address: text("Alamat", 5, 250),
  latitude: coordinate("Latitude", -90, 90),
  longitude: coordinate("Longitude", -180, 180),
};

const coordinatePair = (value) => {
  if (value.latitude === undefined && value.longitude === undefined) return true;
  const hasLat = value.latitude !== undefined && value.latitude !== null;
  const hasLng = value.longitude !== undefined && value.longitude !== null;
  return hasLat === hasLng;
};

export const propertyCreateSchema = z.object(propertyFields).refine(coordinatePair, {
  error: "Latitude dan longitude harus diisi bersama atau dikosongkan bersama",
  path: ["latitude"],
});

export const propertyUpdateSchema = z.object(propertyFields).partial().refine(coordinatePair, {
  error: "Latitude dan longitude harus diisi bersama atau dikosongkan bersama",
  path: ["latitude"],
});

export const businessStatusSchema = z.object({
  businessStatus: z.enum(BUSINESS_STATUSES, { error: "Status bisnis tidak dikenal" }),
});

export const verificationSchema = z
  .object({
    decision: z.enum(["approved", "rejected"], { error: "Keputusan tidak dikenal" }),
    note: z.string().trim().max(500, { error: "Catatan maksimal 500 karakter" }).optional(),
  })
  .refine((value) => value.decision !== "rejected" || (value.note ?? "").trim().length >= 5, {
    error: "Alasan penolakan wajib diisi minimal 5 karakter",
    path: ["note"],
  });

// --- Pengajuan ----------------------------------------------------------

export const inquiryCreateSchema = z.object({
  propertyId: z.string().uuid({ error: "Properti tidak valid" }),
  inquiryType: z.enum(INQUIRY_TYPES, { error: "Jenis pengajuan harus kunjungan atau minat_beli" }),
  message: z
    .string()
    .trim()
    .max(1000, { error: "Pesan maksimal 1000 karakter" })
    .optional()
    .default(""),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["dihubungi", "kunjungan_dijadwalkan", "selesai", "ditolak"], {
    error: "Status tujuan tidak dikenal",
  }),
  note: z.string().trim().max(500, { error: "Catatan maksimal 500 karakter" }).optional(),
});

export const inquiryCancelSchema = z.object({
  reason: z.string().trim().max(500, { error: "Alasan maksimal 500 karakter" }).optional(),
});

// --- Favorit ------------------------------------------------------------

export const favoriteSchema = z.object({
  propertyId: z.string().uuid({ error: "Properti tidak valid" }),
});

// --- Proyek & kategori --------------------------------------------------

export const projectSchema = z.object({
  name: text("Nama proyek", 2, 120),
  slug: slugField.optional(),
  description: z.string().trim().max(3000, { error: "Deskripsi maksimal 3000 karakter" }).default(""),
  address: z.string().trim().max(250, { error: "Alamat maksimal 250 karakter" }).default(""),
  latitude: coordinate("Latitude", -90, 90),
  longitude: coordinate("Longitude", -180, 180),
  coverImagePath: z.string().trim().max(300).optional(),
  isActive: z.boolean().optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const categorySchema = z.object({
  name: text("Nama kategori", 2, 80),
  slug: slugField.optional(),
  isActive: z.boolean().optional(),
});

export const categoryUpdateSchema = categorySchema.partial();

// --- Pengguna -----------------------------------------------------------

export const userUpdateSchema = z.object({
  role: z.enum(USER_ROLES, { error: "Role tidak dikenal" }).optional(),
  isActive: z.boolean().optional(),
});

export const staffCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Format email tidak valid" })),
  password: z
    .string()
    .min(8, { error: "Kata sandi minimal 8 karakter" })
    .max(72, { error: "Kata sandi maksimal 72 karakter" })
    .regex(/[A-Za-z]/, { error: "Kata sandi harus memuat huruf" })
    .regex(/[0-9]/, { error: "Kata sandi harus memuat angka" }),
  fullName: text("Nama lengkap", 3, 120),
  phone: z
    .string()
    .trim()
    .regex(/^\+62[0-9]{8,13}$/, { error: "Nomor WhatsApp tidak valid" })
    .optional(),
  role: z.enum(["agent", "admin"], { error: "Role staf harus agent atau admin" }),
});

export const profileUpdateSchema = z.object({
  fullName: text("Nama lengkap", 3, 120),
  phone: z
    .string()
    .trim()
    .regex(/^\+62[0-9]{8,13}$/, { error: "Nomor WhatsApp tidak valid" })
    .optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Kata sandi saat ini wajib diisi" }),
    newPassword: z
      .string()
      .min(8, { error: "Kata sandi baru minimal 8 karakter" })
      .max(72, { error: "Kata sandi maksimal 72 karakter" })
      .regex(/[A-Za-z]/, { error: "Kata sandi harus memuat huruf" })
      .regex(/[0-9]/, { error: "Kata sandi harus memuat angka" }),
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    error: "Kata sandi baru harus berbeda dari yang lama",
    path: ["newPassword"],
  });

// --- Web Push -----------------------------------------------------------

export const pushSubscriptionSchema = z.object({
  endpoint: z
    .string()
    .trim()
    .url({ error: "Endpoint subscription tidak valid" })
    .startsWith("https://", { error: "Endpoint wajib HTTPS" })
    .max(2000),
  keys: z.object({
    p256dh: z.string().trim().min(20, { error: "Kunci p256dh tidak valid" }).max(300),
    auth: z.string().trim().min(8, { error: "Kunci auth tidak valid" }).max(300),
  }),
});

export const pushUnsubscribeSchema = z.object({
  endpoint: z.string().trim().url({ error: "Endpoint subscription tidak valid" }).max(2000),
});
