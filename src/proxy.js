import { NextResponse } from "next/server";

/**
 * Proxy (pengganti middleware pada Next.js 16).
 *
 * Tugas saat ini: meneruskan `pathname` request ke server component lewat
 * header `x-pathname`, supaya NavbarSite dapat menandai menu yang aktif.
 * Layout grup (site) membaca header ini.
 *
 * Header dibuat ulang per request (bukan dari header klien) agar tidak bisa
 * dipalsukan dari browser.
 */
export function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Lewati aset statis dan berkas Next.js internal.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo_sang.png).*)"],
};
