"use server";

import { redirect } from "next/navigation";

import { consume, reset, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { upsertBuyerProfile } from "@/lib/auth/profile";
import { createSessionForProfile } from "@/lib/auth/session";
import { signUpAccount } from "@/lib/auth/supabase-server";
import { logAuth } from "@/lib/logging/logger";
import {
  registerBuyerSchema,
  formDataToObject,
  toFieldErrors,
} from "@/lib/validators/auth";

/**
 * Registrasi pembeli.
 *
 * Supabase Auth membuat kredensial; tabel profiles menyimpan identitas dan
 * role `buyer`. Bila konfirmasi email aktif di Supabase, pengguna diarahkan ke
 * login dengan pesan untuk membuka email sebelum sesi dibuat.
 */
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
    return {
      ok: false,
      formError: null,
      fieldErrors: toFieldErrors(parsed.error),
      switchPortal: null,
    };
  }

  const { fullName, email, phone, password } = parsed.data;
  const rateKey = `register:${email}`;
  const limit = consume(rateKey, RATE_LIMITS.register);
  if (!limit.ok) {
    return {
      ok: false,
      formError: `Terlalu banyak pendaftaran. Coba lagi dalam ${limit.retryAfterSeconds} detik.`,
      fieldErrors: {},
      switchPortal: null,
    };
  }

  const signUp = await signUpAccount({ email, password, fullName, phone });
  if (!signUp.ok) {
    return {
      ok: false,
      formError: signUp.message,
      fieldErrors: {},
      switchPortal: null,
    };
  }

  // Supabase mengembalikan user tanpa identities untuk email yang sudah ada
  // (agar tidak membocorkan status pendaftaran). Perlakukan sebagai email
  // terdaftar tanpa menyebut detail akun.
  if (Array.isArray(signUp.user.identities) && signUp.user.identities.length === 0) {
    return {
      ok: false,
      formError: "Email sudah terdaftar. Silakan masuk atau gunakan email lain.",
      fieldErrors: {},
      switchPortal: null,
    };
  }

  const profileResult = await upsertBuyerProfile({
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
      switchPortal: null,
    };
  }

  reset(rateKey);
  logAuth("register_success", {
    userId: profileResult.profile.id,
    role: profileResult.profile.role,
  });

  if (signUp.session) {
    try {
      await createSessionForProfile(profileResult.profile, { remember: false });
    } catch (error) {
      logAuth("session_write_failed", {
        userId: profileResult.profile.id,
        role: profileResult.profile.role,
        message: error instanceof Error ? error.message : String(error),
      });
      redirect("/login?registered=1", "push");
    }

    redirect("/dashboard/pembeli", "push");
  }

  redirect("/login?registered=1&confirm=1", "push");
}
