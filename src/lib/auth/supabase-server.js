import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Klien Supabase Auth untuk server.
 *
 * Supabase dipakai sebagai penyedia identitas (SRS BR-03). Beda dengan versi
 * sebelumnya yang memakai `createClient` tanpa penyimpanan sesi, klien ini
 * memakai `@supabase/ssr` sehingga cookie sesi Supabase ditulis oleh Server
 * Action / Route Handler. Cookie inilah yang dibaca `getCurrentUser()`通过
 * `supabase.auth.getUser()` pada setiap permintaan (lihat current-user.js).
 *
 * Data bisnis tetap lewat Prisma; Supabase tidak dipakai untuk `from(...)`.
 */
export function isAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Klien Auth yang terikat cookie request saat ini. */
export async function getAuthClient() {
  if (!isAuthConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component tidak boleh menulis cookie; penyegaran token
            // ditangani oleh proxy.
          }
        },
      },
    },
  );
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
 * Verifikasi email + kata sandi ke Supabase Auth dan simpan sesinya di cookie.
 * @returns {{ ok: true, user: object } | { ok: false, message: string }}
 */
export async function signInWithPassword({ email, password }) {
  const client = await getAuthClient();
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
  const client = await getAuthClient();
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
