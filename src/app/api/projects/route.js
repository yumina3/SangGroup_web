import { ok, withRoute } from "@/lib/http/api";
import { listPublicProjects } from "@/lib/services/projects";

/** Daftar proyek publik (FR-02). */
export const GET = withRoute(async () => {
  return ok({ items: await listPublicProjects() });
});
