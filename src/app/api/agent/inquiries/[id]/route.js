import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { updateInquiryStatus } from "@/lib/services/inquiries";
import { inquiryStatusSchema } from "@/lib/validators/domain";

/** Tindak lanjut pengajuan oleh agen pemilik listing (FR-36). */
export const PATCH = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;
  const input = await readJson(request, inquiryStatusSchema);
  return ok(await updateInquiryStatus(user, id, input));
});
