import { ok, withRoute } from "@/lib/http/api";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Logout: hapus sesi Supabase (cookie). */
export const POST = withRoute(async () => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return ok({ signedOut: true });
});
