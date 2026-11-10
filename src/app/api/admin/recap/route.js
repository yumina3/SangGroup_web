import { requireApiUser } from "@/lib/auth/current-user";
import { ok, withRoute } from "@/lib/http/api";
import { listRecentInquiriesForAdmin } from "@/lib/services/admin";
import { getAdminRecap } from "@/lib/services/properties";

/** Rekap admin dari database (FR-42, FR-43). */
export const GET = withRoute(async () => {
  await requireApiUser(["admin"]);
  const [recap, recentInquiries] = await Promise.all([
    getAdminRecap(),
    listRecentInquiriesForAdmin(10),
  ]);
  return ok({ ...recap, recentInquiries });
});
