import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { updateProject } from "@/lib/services/projects";
import { projectUpdateSchema } from "@/lib/validators/domain";

export const PATCH = withRoute(async (request, { params }) => {
  await requireApiUser(["admin"]);
  const { id } = await params;
  const input = await readJson(request, projectUpdateSchema);
  return ok(await updateProject(id, input));
});
