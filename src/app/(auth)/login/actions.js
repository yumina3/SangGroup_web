"use server";

import { loginSchema, formDataToObject, toFieldErrors } from "@/lib/validators/auth";

/**
 * Validasi server untuk form login. Belum menyentuh Supabase maupun database;
 * bentuk nilai yang dikembalikan sudah final agar UI tidak perlu diubah ketika
 * penyambungan auth dilakukan.
 */
export async function loginAction(_prevState, formData) {
  const raw = formDataToObject(formData, ["email", "password", "next"]);
  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, formError: null, fieldErrors: toFieldErrors(parsed.error) };
  }

  return {
    ok: false,
    formError:
      "Layanan autentikasi belum dikonfigurasi. Hubungi admin untuk mengaktifkan akses.",
    fieldErrors: {},
  };
}
