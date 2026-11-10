import { getCurrentUser } from "@/lib/auth/current-user";
import { ok, withRoute } from "@/lib/http/api";

/** Siapa yang sedang login menurut sesi Supabase. */
export const GET = withRoute(async () => {
  const user = await getCurrentUser();
  return ok({ user });
});
