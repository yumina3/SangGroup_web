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
