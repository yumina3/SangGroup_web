import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, readPagination, withRoute } from "@/lib/http/api";
import { createStaffUser, listUsers } from "@/lib/services/admin";
import { staffCreateSchema } from "@/lib/validators/domain";

/** Admin melihat dan membuat akun staf (FR-41). */
export const GET = withRoute(async (request) => {
  await requireApiUser(["admin"]);
  const { searchParams } = request.nextUrl;
  const { page, pageSize } = readPagination(searchParams, { defaultSize: 20 });

  return ok(
    await listUsers({
      page,
      pageSize,
      role: searchParams.get("role") ?? "",
      q: searchParams.get("q")?.trim() ?? "",
    }),
  );
});

export const POST = withRoute(async (request) => {
  await requireApiUser(["admin"]);
  const input = await readJson(request, staffCreateSchema);
  return ok(await createStaffUser(input), { status: 201 });
});
