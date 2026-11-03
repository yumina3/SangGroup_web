import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/**
 * Proxy (pengganti middleware Next 16).
 *
 * Satu tugas: meng-inject `x-pathname` untuk permintaan GET/HEAD agar komponen
 * layout bisa membaca rute aktif untuk navigasi sidebar. Metode lain (POST dsb.,
 * termasuk Server Action) tidak disentuh sama sekali.
 */
export function proxy(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);

  const res = NextResponse.next({ request: { headers } });
  res.headers.delete("x-pathname");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo_sang.png).*)"],
};
