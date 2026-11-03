"use server";

import {
  registerAgentSchema,
  formDataToObject,
  toFieldErrors,
} from "@/lib/validators/auth";

export async function registerAgentAction(_prevState, formData) {
  const raw = formDataToObject(formData, [
    "fullName",
    "agencyName",
    "email",
    "phone",
    "password",
    "confirmPassword",
  ]);
  const parsed = registerAgentSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, formError: null, fieldErrors: toFieldErrors(parsed.error) };
  }

  return {
    ok: false,
    formError:
      "Pendaftaran agen belum dapat diproses: layanan autentikasi dan database belum dikonfigurasi.",
    fieldErrors: {},
  };
}
