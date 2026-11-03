import { z } from "zod";

/**
 * Skema validasi auth. Dipakai di klien (pesan cepat) dan di Server Action
 * (sumber kebenaran). Constraint database adalah lapisan ketiganya.
 */

const fullName = z
  .string()
  .trim()
  .min(3, { error: "Nama lengkap minimal 3 karakter" })
  .max(120, { error: "Nama lengkap maksimal 120 karakter" });

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { error: "Email wajib diisi" })
  .max(254, { error: "Email terlalu panjang" })
  .pipe(z.email({ error: "Format email tidak valid" }));

/**
 * Menerima 08xx, +62xx, atau 62xx. Setelah normalisasi selalu +62xxxxxxxxx.
 */
export const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()-]/g, ""))
  .transform((value) => {
    if (value.startsWith("+62")) return `+62${value.slice(3)}`;
    if (value.startsWith("62")) return `+62${value.slice(2)}`;
    if (value.startsWith("0")) return `+62${value.slice(1)}`;
    return value;
  })
  .refine((value) => /^\+62[0-9]{8,13}$/.test(value), {
    error: "Nomor WhatsApp tidak valid",
  });

const password = z
  .string()
  .min(8, { error: "Minimal 8 karakter, kombinasi huruf dan angka" })
  .max(72, { error: "Kata sandi maksimal 72 karakter" })
  .regex(/[A-Za-z]/, { error: "Minimal 8 karakter, kombinasi huruf dan angka" })
  .regex(/[0-9]/, { error: "Minimal 8 karakter, kombinasi huruf dan angka" });

const confirmPassword = z.string().min(1, { error: "Konfirmasi kata sandi wajib diisi" });

/** Field pengaman: Server Action tidak pernah membaca peran dari klien. */
export const registerBuyerSchema = z
  .object({
    fullName,
    email,
    phone,
    password,
    confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Konfirmasi kata sandi tidak sama",
    path: ["confirmPassword"],
  });

export const registerAgentSchema = z
  .object({
    fullName,
    email,
    phone,
    agencyName: z
      .string()
      .trim()
      .min(2, { error: "Nama agen/agensi minimal 2 karakter" })
      .max(120, { error: "Nama agen/agensi maksimal 120 karakter" }),
    password,
    confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Konfirmasi kata sandi tidak sama",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Kata sandi wajib diisi" }),
  next: z.string().optional(),
});

/**
 * FormData -> objek polos. Hanya field yang dikenal yang dibaca.
 */
export function formDataToObject(formData, keys) {
  const result = {};
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string") result[key] = value;
  }
  return result;
}

/** Ubah ZodError menjadi peta field -> pesan pertama. */
export function toFieldErrors(error) {
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path?.[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
