import { requireApiUser } from "@/lib/auth/current-user";
import { ok, withRoute } from "@/lib/http/api";
import { resubmitProperty } from "@/lib/services/properties";

/** Kirim ulang listing yang ditolak ke antrean verifikasi. */
export const POST = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;
  return ok(await resubmitProperty(user.id, id));
});
