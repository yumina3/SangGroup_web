import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Proxy (pengganti middleware Next 16).
 *
 * Dua tugas:
 * 1. Menyegarkan sesi Supabase Auth (cookie) sebelum render.
 * 2. Meng-inject `x-pathname` untuk permintaan GET/HEAD agar layout dapat
 *    membaca rute aktif.
 */
export async function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  if (request.method === "GET" || request.method === "HEAD") {
    requestHeaders.set("x-pathname", request.nextUrl.pathname);
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request: { headers: requestHeaders } });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });

    // Wajib dipanggil agar token yang hampir kedaluwarsa diperbarui.
    await supabase.auth.getUser();
  }

  if (request.method === "GET" || request.method === "HEAD") {
    response.headers.delete("x-pathname");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo_sang.png|sw\\.js).*)"],
};
