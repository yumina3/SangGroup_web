import { consume, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators/auth";

/** Login API memakai Supabase Auth; peran dibaca dari tabel profiles. */
export const POST = withRoute(async (request) => {
  const body = await readJson(request, loginSchema);

  const limit = consume(`api-login:${body.email}`, RATE_LIMITS.login);
  if (!limit.ok) {
    throw new AppError(
      ERROR_CODES.RATE_LIMITED,
      `Terlalu banyak percobaan masuk. Coba lagi dalam ${limit.retryAfterSeconds} detik.`,
      { status: 429 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error || !data.user) {
    throw new AppError(ERROR_CODES.UNAUTHENTICATED, "Email atau kata sandi tidak sesuai.", {
      status: 401,
    });
  }

  const profile = await getDb().profile.findUnique({
    where: { id: data.user.id },
    select: { role: true, isActive: true, fullName: true },
  });

  if (!profile || !profile.isActive) {
    await supabase.auth.signOut();
    throw new AppError(ERROR_CODES.FORBIDDEN, "Akun ini dinonaktifkan.", { status: 403 });
  }

  return ok({
    user: {
      id: data.user.id,
      email: data.user.email,
      fullName: profile.fullName,
      role: profile.role,
    },
  });
});
