import { requireApiUser } from "@/lib/auth/current-user";
import { ok, withRoute } from "@/lib/http/api";
import { markNotificationRead } from "@/lib/services/notifications";

export const PATCH = withRoute(async (request, { params }) => {
  const user = await requireApiUser();
  const { id } = await params;
  await markNotificationRead(user.id, id);
  return ok({ id, read: true });
});
