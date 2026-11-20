import { ok, readNumberParam, readPagination, withRoute } from "@/lib/http/api";
import { listPublicProperties } from "@/lib/services/properties";

/**
 * Katalog publik (FR-06..FR-08). Hanya listing `approved`.
 * Filter yang sama dipakai peta sehingga kartu dan marker konsisten (FR-11).
 */
export const GET = withRoute(async (request) => {
  const { searchParams } = request.nextUrl;
  const { page, pageSize } = readPagination(searchParams, { defaultSize: 12 });

  return ok(
    await listPublicProperties({
      page,
      pageSize,
      q: searchParams.get("q")?.trim() ?? "",
      project: searchParams.get("project") ?? "",
      category: searchParams.get("category") ?? "",
      businessStatus: searchParams.get("status") ?? "",
      minPrice: readNumberParam(searchParams, "minPrice"),
      maxPrice: readNumberParam(searchParams, "maxPrice"),
      minLand: readNumberParam(searchParams, "minLand"),
      maxLand: readNumberParam(searchParams, "maxLand"),
      minBuilding: readNumberParam(searchParams, "minBuilding"),
      maxBuilding: readNumberParam(searchParams, "maxBuilding"),
    }),
  );
});
