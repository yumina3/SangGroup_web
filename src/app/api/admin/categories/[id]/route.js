import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { updateCategory } from "@/lib/services/categories";
import { categoryUpdateSchema } from "@/lib/validators/domain";

export const PATCH = withRoute(async (request, { params }) => {
  await requireApiUser(["admin"]);
  const { id } = await params;
  const input = await readJson(request, categoryUpdateSchema);
  return ok(await updateCategory(id, input));
});
