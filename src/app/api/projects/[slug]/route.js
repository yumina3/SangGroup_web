import { AppError, ERROR_CODES } from "@/lib/errors";
import { ok, withRoute } from "@/lib/http/api";
import { getPublicProjectBySlug } from "@/lib/services/projects";

/** Detail proyek publik berdasarkan slug (FR-03, FR-04). */
export const GET = withRoute(async (request, { params }) => {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Proyek tidak ditemukan.", { status: 404 });
  }
  return ok(project);
});
