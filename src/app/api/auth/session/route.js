import { NextResponse } from "next/server";

import { getSessionProfile } from "@/lib/auth/session";

/**
 * Ringkasan sesi untuk menu navbar publik. Cookie sesi bersifat httpOnly,
 * jadi hanya endpoint server ini yang bisa membacanya. Data yang dikirim
 * sengaja minimal (tanpa email) karena hanya untuk menentukan label menu.
 */
export async function GET() {
  const profile = await getSessionProfile();

  if (!profile) {
    return NextResponse.json(
      { authenticated: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      profile: {
        id: profile.id,
        fullName: profile.fullName,
        role: profile.role,
        status: profile.status,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
