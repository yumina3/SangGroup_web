import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Klien service-role: HANYA untuk operasi server tepercaya (membuat akun staf,
 * upload/hapus berkas, membaca data admin). Kunci ini tidak boleh pernah
 * dikirim ke browser.
 */

export function isServiceRoleConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseAdmin() {
  if (!isServiceRoleConfigured()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
