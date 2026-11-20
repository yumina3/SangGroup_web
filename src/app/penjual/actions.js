"use server";

import { redirect } from "next/navigation";

import { consume, reset, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { getDb } from "@/lib/db/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formDataToObject, loginSchema, toFieldErrors } from "@/lib/validators/auth";

const HOME_BY_ROLE = {
  agent: "/dashboard/penjual",
  admin: "/admin",
  buyer: "/akun",
};

/**
 * Login memakai Supabase Auth (BR-03, FR-20).
 *
 * Peran dibaca dari tabel profiles, bukan dari form. Akun nonaktif langsung
 * di-sign-out agar tidak meninggalkan sesi setengah jadi.
 */
export async function penjualLoginAction(_prevState, formData) {
  const raw = formDataToObject(formData, ["email", "password"]);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, formError: null, fieldErrors: toFieldErrors(parsed.error) };
  }

  const key = `login:${parsed.data.email}`;
  const limit = consume(key, RATE_LIMITS.login);
  if (!limit.ok) {
    return {
      ok: false,
      formError: `Terlalu banyak percobaan masuk. Coba lagi dalam ${limit.retryAfterSeconds} detik.`,
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      ok: false,
      formError: "Email atau kata sandi tidak sesuai. Periksa kembali.",
      fieldErrors: {},
    };
  }

  const profile = await getDb().profile.findUnique({
    where: { id: data.user.id },
    select: { role: true, isActive: true },
  });

  if (!profile || !profile.isActive) {
    await supabase.auth.signOut();
    return {
      ok: false,
      formError: "Akun ini dinonaktifkan. Hubungi admin SANG Group.",
      fieldErrors: {},
    };
  }

  reset(key);
  redirect(HOME_BY_ROLE[profile.role] ?? "/");
}

/** Logout dari mana pun. */
export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

/** Logout dari area agen, kembali ke gerbang login. */
export async function penjualLogoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/penjual");
}
