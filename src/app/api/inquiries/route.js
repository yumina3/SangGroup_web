import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, readPagination, withRoute } from "@/lib/http/api";
import { createInquiry, listAgentInquiries, listAllInquiries, listBuyerInquiries } from "@/lib/services/inquiries";
import { inquiryCreateSchema } from "@/lib/validators/domain";

/**
 * Pengajuan: pembeli melihat miliknya, agen melihat pengajuan listingnya,
 * admin melihat rekap (FR-28, FR-29, FR-35, FR-42).
 */
export const GET = withRoute(async (request) => {
  const user = await requireApiUser(["buyer", "agent", "admin"]);
  const { searchParams } = request.nextUrl;
  const { page, pageSize } = readPagination(searchParams, { defaultSize: 20 });

  if (user.role === "agent") {
    return ok(
      await listAgentInquiries(user.id, {
        page,
        pageSize,
        status: searchParams.get("status") ?? "",
        inquiryType: searchParams.get("type") ?? "",
      }),
    );
  }
  if (user.role === "admin") {
    return ok(
      await listAllInquiries({ page, pageSize, status: searchParams.get("status") ?? "" }),
    );
  }

  return ok(await listBuyerInquiries(user.id, { page, pageSize }));
});

/** Pembeli mengirim pengajuan kunjungan/minat beli. */
export const POST = withRoute(async (request) => {
  const user = await requireApiUser(["buyer"]);
  const input = await readJson(request, inquiryCreateSchema);
  return ok(await createInquiry(user.id, input), { status: 201 });
});
