import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { updateUser } from "@/lib/services/admin";
import { userUpdateSchema } from "@/lib/validators/domain";

/** Ubah role/status akun (FR-41). */
export const PATCH = withRoute(async (request, { params }) => {
  const admin = await requireApiUser(["admin"]);
  const { id } = await params;
  const input = await readJson(request, userUpdateSchema);
  return ok(await updateUser(admin.id, id, input));
});
