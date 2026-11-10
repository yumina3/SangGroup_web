import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readPagination, withRoute } from "@/lib/http/api";
import { listAdminProperties } from "@/lib/services/properties";

/** Admin melihat listing berdasarkan status verifikasi/proyek/agen/status bisnis (FR-38). */
export const GET = withRoute(async (request) => {
  await requireApiUser(["admin"]);
  const { searchParams } = request.nextUrl;
  const { page, pageSize } = readPagination(searchParams, { defaultSize: 20 });

  return ok(
    await listAdminProperties({
      page,
      pageSize,
      verificationStatus: searchParams.get("verificationStatus") ?? "",
      projectId: searchParams.get("projectId") ?? "",
      ownerId: searchParams.get("ownerId") ?? "",
      businessStatus: searchParams.get("businessStatus") ?? "",
    }),
  );
});
