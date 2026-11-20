import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { getInquiryForUser, updateInquiryStatus } from "@/lib/services/inquiries";
import { inquiryStatusSchema } from "@/lib/validators/domain";

export const GET = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["buyer", "agent", "admin"]);
  const { id } = await params;
  return ok(await getInquiryForUser(user, id));
});

/** Agen/admin memperbarui status tindak lanjut (FR-36, VL-17). */
export const PATCH = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent", "admin"]);
  const { id } = await params;
  const input = await readJson(request, inquiryStatusSchema);
  return ok(await updateInquiryStatus(user, id, input));
});
