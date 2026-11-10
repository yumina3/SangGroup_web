"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Klien Supabase untuk komponen klien (mis. upload berkas langsung). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
