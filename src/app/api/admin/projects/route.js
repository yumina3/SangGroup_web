import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { createProject, listAllProjects } from "@/lib/services/projects";
import { projectSchema } from "@/lib/validators/domain";

/** Admin mengelola data proyek (FR-40). */
export const GET = withRoute(async () => {
  await requireApiUser(["admin"]);
  return ok({ items: await listAllProjects() });
});

export const POST = withRoute(async (request) => {
  await requireApiUser(["admin"]);
  const input = await readJson(request, projectSchema);
  return ok(await createProject(input), { status: 201 });
});
