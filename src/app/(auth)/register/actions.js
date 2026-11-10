"use server";

import { redirect } from "next/navigation";

import { clientMeta } from "@/lib/auth/current-user";
import { consume, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  formDataToObject,
  registerBuyerSchema,
  toFieldErrors,
} from "@/lib/validators/auth";

/**
 * Registrasi pembeli memakai Supabase Auth (FR-20, FR-21).
 *
 * Peran tidak dikirim dari form; trigger `handle_new_user` membuat profil
 * dengan role buyer. Bila konfirmasi email aktif di Supabase, sesi belum
 * terbentuk dan pengguna diminta memeriksa email.
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
    return { ok: false, formError: null, fieldErrors: toFieldErrors(parsed.error) };
  }

  const meta = await clientMeta();
  const limit = consume(`register:${meta.ipAddress ?? "unknown"}`, RATE_LIMITS.register);
  if (!limit.ok) {
    return {
      ok: false,
      formError: "Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti.",
      fieldErrors: {},
    };
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return {
      ok: false,
      formError:
        "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.",
      fieldErrors: {},
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      return {
        ok: false,
        formError: "Email sudah terdaftar. Silakan masuk.",
        fieldErrors: { email: "Email sudah terdaftar" },
      };
    }
    return { ok: false, formError: error.message, fieldErrors: {} };
  }

  if (!data.session) {
    return {
      ok: true,
      formError: null,
      fieldErrors: {},
      success:
        "Pendaftaran berhasil. Periksa email untuk konfirmasi, lalu masuk ke akun Anda.",
    };
  }

  redirect("/akun");
}
