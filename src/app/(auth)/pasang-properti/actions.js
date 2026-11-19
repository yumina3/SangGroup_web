"use server";

import { redirect } from "next/navigation";

import { consume, reset, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { upsertAgentProfile } from "@/lib/auth/profile";
import { signUpAccount } from "@/lib/auth/supabase-server";
import { logAuth } from "@/lib/logging/logger";
import {
  registerAgentSchema,
  formDataToObject,
  toFieldErrors,
} from "@/lib/validators/auth";

/**
 * Pendaftaran agen. Akun Supabase dibuat lebih dulu, lalu profil aplikasi
 * disimpan dengan role `agent` dan status `pending`. Dashboard baru bisa
 * diakses setelah admin menyetujui.
 */
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
    return {
      ok: false,
      formError: null,
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { fullName, agencyName, email, phone, password } = parsed.data;
  const rateKey = `register-agent:${email}`;
  const limit = consume(rateKey, RATE_LIMITS.register);
  if (!limit.ok) {
    return {
      ok: false,
      formError: `Terlalu banyak pendaftaran. Coba lagi dalam ${limit.retryAfterSeconds} detik.`,
      fieldErrors: {},
    };
  }

  const signUp = await signUpAccount({
    email,
    password,
    fullName,
    phone,
    agencyName,
  });

  if (!signUp.ok) {
    return { ok: false, formError: signUp.message, fieldErrors: {} };
  }

  if (Array.isArray(signUp.user.identities) && signUp.user.identities.length === 0) {
    return {
      ok: false,
      formError: "Email sudah terdaftar. Silakan masuk atau gunakan email lain.",
      fieldErrors: {},
    };
  }

  const profileResult = await upsertAgentProfile({
    id: signUp.user.id,
    fullName,
    phone,
  });

  if (!profileResult.ok) {
    logAuth("register_profile_failed", {
      userId: signUp.user.id,
      code: profileResult.code,
    });

    return {
      ok: false,
      formError:
        profileResult.code === "email_taken"
          ? "Email sudah terdaftar. Silakan masuk atau gunakan email lain."
          : profileResult.code === "db_not_configured"
            ? "Database profil belum tersambung. Hubungi admin Sang Group."
            : "Akun dibuat, tetapi profil gagal disimpan. Hubungi admin Sang Group.",
      fieldErrors: {},
    };
  }

  reset(rateKey);
  logAuth("register_success", {
    userId: profileResult.profile.id,
    role: profileResult.profile.role,
    status: profileResult.profile.status,
  });

  const params = new URLSearchParams({ registered: "1", pending: "1" });
  if (!signUp.session) params.set("confirm", "1");

  redirect(`/login-agen?${params.toString()}`, "push");
}
