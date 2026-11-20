import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { cancelInquiry } from "@/lib/services/inquiries";
import { inquiryCancelSchema } from "@/lib/validators/domain";

/** Pembeli membatalkan pengajuan aktif (BR-29). */
export const POST = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["buyer"]);
  const { id } = await params;
  const body = await readJson(request, inquiryCancelSchema);
  return ok(await cancelInquiry(user.id, id, body.reason ?? ""));
});
