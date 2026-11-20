import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readPagination, withRoute } from "@/lib/http/api";
import { listNotifications, markAllNotificationsRead } from "@/lib/services/notifications";

/** Notifikasi milik pengguna (Web Push outbox). */
export const GET = withRoute(async (request) => {
  const user = await requireApiUser();
  const { searchParams } = request.nextUrl;
  const { page, pageSize } = readPagination(searchParams, { defaultSize: 20 });
  return ok(
    await listNotifications(user.id, {
      page,
      pageSize,
      unreadOnly: searchParams.get("unread") === "1",
    }),
  );
});

export const PATCH = withRoute(async () => {
  const user = await requireApiUser();
  const updated = await markAllNotificationsRead(user.id);
  return ok({ updated });
});
