import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase Auth untuk server.
 *
 * Supabase dipakai HANYA sebagai penyedia identitas (PRD §4.1). Data bisnis
 * tetap lewat Prisma. Selama env belum diisi, fungsi ini mengembalikan null
 * agar halaman auth menampilkan keadaan "belum dikonfigurasi", bukan error 500.
 */
export function isAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function createAuthClient() {
  if (!isAuthConfigured()) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export function getAuthClient() {
  return createAuthClient();
}

/** Pesan Indonesia yang tidak membocorkan apakah sebuah email terdaftar. */
export function authErrorMessage(error) {
  switch (error?.code) {
    case "invalid_credentials":
      return "Email atau kata sandi tidak sesuai.";
    case "email_not_confirmed":
      return "Email belum dikonfirmasi. Buka tautan konfirmasi di kotak masuk Anda, lalu coba lagi.";
    case "too_many_requests":
    case "over_request_rate_limit":
      return "Terlalu banyak percobaan masuk. Tunggu beberapa saat lalu coba lagi.";
    case "user_already_exists":
    case "email_exists":
      return "Email sudah terdaftar. Silakan masuk.";
    case "signup_disabled":
      return "Pendaftaran akun sedang ditutup. Hubungi admin Sang Group.";
    default:
      return "Autentikasi gagal. Periksa koneksi lalu coba lagi.";
  }
}

/**
 * Verifikasi email + kata sandi ke Supabase Auth.
 * @returns {{ ok: true, user: object } | { ok: false, message: string }}
 */
export async function signInWithPassword({ email, password }) {
  const client = getAuthClient();
  if (!client) {
    return {
      ok: false,
      message:
        "Layanan autentikasi belum dikonfigurasi. Hubungi admin Sang Group.",
    };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, message: authErrorMessage(error) };
  }

  if (!data?.user) {
    return { ok: false, message: "Akun tidak dapat diverifikasi. Coba lagi." };
  }

  return { ok: true, user: data.user };
}

/**
 * Buat akun Supabase untuk pembeli atau agen. Profil aplikasi dibuat terpisah
 * oleh pemanggil agar role tidak pernah berasal dari metadata yang bisa diubah
 * pengguna.
 *
 * @returns {{ ok: true, user: object, session: object|null } | { ok: false, message: string }}
 */
export async function signUpAccount({
  email,
  password,
  fullName,
  phone,
  agencyName,
}) {
  const client = getAuthClient();
  if (!client) {
    return {
      ok: false,
      message:
        "Layanan autentikasi belum dikonfigurasi. Hubungi admin Sang Group.",
    };
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        fullName,
        phone,
        ...(agencyName ? { agency_name: agencyName, agencyName } : {}),
      },
    },
  });

  if (error) {
    return { ok: false, message: authErrorMessage(error) };
  }

  if (!data?.user) {
    return { ok: false, message: "Pendaftaran tidak dapat diproses. Coba lagi." };
  }

  return { ok: true, user: data.user, session: data.session ?? null };
}
