import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readPagination, withRoute } from "@/lib/http/api";
import { listAgentInquiries } from "@/lib/services/inquiries";

/** Pengajuan atas listing milik agen (FR-35). */
export const GET = withRoute(async (request) => {
  const user = await requireApiUser(["agent"]);
  const { searchParams } = request.nextUrl;
  const { page, pageSize } = readPagination(searchParams, { defaultSize: 20 });

  return ok(
    await listAgentInquiries(user.id, {
      page,
      pageSize,
      status: searchParams.get("status") ?? "",
      inquiryType: searchParams.get("type") ?? "",
    }),
  );
});
