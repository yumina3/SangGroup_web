import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

/**
 * Identitas pengguna untuk request berjalan.
 *
 * Sesi berasal dari Supabase Auth (BR-03, FR-20). Profil (role, status aktif)
 * dibaca dari tabel `profiles` yang terhubung ke auth.users. Pembatasan role
 * TIDAK pernah dipercaya dari klien.
 */
export const getCurrentUser = cache(async () => {
  await connection();

  if (!isSupabaseConfigured() || !isDatabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const db = getDb();
  let profile = await db.profile.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullName: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  // Jaring pengaman bila trigger handle_new_user belum terpasang.
  if (!profile) {
    profile = await db.profile.create({
      data: {
        id: user.id,
        fullName:
          (user.user_metadata?.full_name && String(user.user_metadata.full_name)) ||
          user.email?.split("@")[0] ||
          "Pengguna",
        phone: user.user_metadata?.phone ? String(user.user_metadata.phone) : null,
        role: "buyer",
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });
  }

  if (!profile.isActive) return null;

  return {
    id: profile.id,
    email: user.email ?? "",
    fullName: profile.fullName,
    phone: profile.phone,
    role: profile.role,
    isActive: profile.isActive,
  };
});

/**
 * Halaman beranda tiap peran. Dipakai saat pengguna membuka halaman milik
 * peran lain: diarahkan ke dashboard-nya sendiri, bukan halaman 403.
 */
export const HOME_BY_ROLE = {
  buyer: "/akun",
  agent: "/dashboard/penjual",
  admin: "/admin",
};

/**
 * Penjaga halaman: tanpa sesi diarahkan ke gerbang login; pengguna dengan
 * peran berbeda diarahkan ke beranda perannya sendiri (bukan 403) agar tidak
 * terlihat seperti error.
 */
export async function requirePageUser(roles) {
  const user = await getCurrentUser();
  if (!user) redirect("/penjual");
  if (roles && !roles.includes(user.role)) {
    redirect(HOME_BY_ROLE[user.role] ?? "/");
  }
  return user;
}

/**
 * Penjaga Route Handler: melempar AppError sehingga `withRoute` menghasilkan
 * 401/403 JSON, bukan redirect HTML.
 */
export async function requireApiUser(roles) {
  const user = await getCurrentUser();
  if (!user) {
    throw new AppError(ERROR_CODES.UNAUTHENTICATED, "Silakan masuk terlebih dahulu.", {
      status: 401,
    });
  }
  if (roles && !roles.includes(user.role)) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "Anda tidak berhak mengakses sumber daya ini.", {
      status: 403,
    });
  }
  return user;
}

/** Metadata klien (tidak dipercaya untuk otorisasi). */
export async function clientMeta() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  return {
    userAgent: store.get("user-agent")?.slice(0, 512) ?? null,
    ipAddress: forwarded?.split(",")[0]?.trim().slice(0, 64) ?? null,
  };
}
