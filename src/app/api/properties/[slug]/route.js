import { AppError, ERROR_CODES } from "@/lib/errors";
import { ok, withRoute } from "@/lib/http/api";
import { getPublicPropertyBySlug } from "@/lib/services/properties";

/** Detail publik berdasarkan slug (FR-15, FR-19). */
export const GET = withRoute(async (request, { params }) => {
  const { slug } = await params;
  const property = await getPublicPropertyBySlug(slug);
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Properti tidak ditemukan.", { status: 404 });
  }
  return ok(property);
});
