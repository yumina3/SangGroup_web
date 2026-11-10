import { clientMeta } from "@/lib/auth/current-user";
import { consume, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { registerBuyerSchema } from "@/lib/validators/auth";

/**
 * Registrasi pembeli via Supabase Auth.
 * Peran tidak dikirim klien; trigger database menetapkan `buyer`.
 */
export const POST = withRoute(async (request) => {
  const meta = await clientMeta();
  const limit = consume(`register:${meta.ipAddress ?? "unknown"}`, RATE_LIMITS.register);
  if (!limit.ok) {
    throw new AppError(ERROR_CODES.RATE_LIMITED, "Terlalu banyak pendaftaran. Coba lagi nanti.", {
      status: 429,
    });
  }

  const body = await readJson(request, registerBuyerSchema);
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: { full_name: body.fullName, phone: body.phone },
    },
  });

  if (error) {
    throw new AppError(ERROR_CODES.CONFLICT, error.message, { status: 409 });
  }

  return ok(
    {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      needsEmailConfirmation: !data.session,
    },
    { status: 201 },
  );
});
