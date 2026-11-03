"use server";

import {
  registerBuyerSchema,
  formDataToObject,
  toFieldErrors,
} from "@/lib/validators/auth";

export async function registerAction(_prevState, formData) {
  const raw = formDataToObject(formData, [
    "fullName",
    "email",
    "phone",
    "password",
    "confirmPassword",
  ]);
  const parsed = registerBuyerSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, formError: null, fieldErrors: toFieldErrors(parsed.error) };
  }

  return {
    ok: false,
    formError:
      "Pendaftaran belum dapat diproses: layanan autentikasi dan database belum dikonfigurasi.",
    fieldErrors: {},
  };
}
