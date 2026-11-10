import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { verifyProperty } from "@/lib/services/properties";
import { verificationSchema } from "@/lib/validators/domain";

/** Setujui/tolak listing; penolakan wajib alasan (FR-39). */
export const POST = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["admin"]);
  const { id } = await params;
  const input = await readJson(request, verificationSchema);
  await verifyProperty(user.id, id, input);
  return ok({ propertyId: id, decision: input.decision });
});
