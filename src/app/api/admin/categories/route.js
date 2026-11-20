import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { createCategory, listAllCategories } from "@/lib/services/categories";
import { categorySchema } from "@/lib/validators/domain";

/** Admin mengelola kategori properti (FR-40). */
export const GET = withRoute(async () => {
  await requireApiUser(["admin"]);
  return ok({ items: await listAllCategories() });
});

export const POST = withRoute(async (request) => {
  await requireApiUser(["admin"]);
  const input = await readJson(request, categorySchema);
  return ok(await createCategory(input), { status: 201 });
});
