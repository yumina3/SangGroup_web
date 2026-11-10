import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { updateBusinessStatus } from "@/lib/services/properties";
import { businessStatusSchema } from "@/lib/validators/domain";

/** Ubah status unit: tersedia / dipesan / terjual (FR-32). */
export const PATCH = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;
  const { businessStatus } = await readJson(request, businessStatusSchema);
  return ok(await updateBusinessStatus(user.id, id, businessStatus));
});
