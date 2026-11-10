import { requireApiUser } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { ok, withRoute } from "@/lib/http/api";
import { isPushConfigured } from "@/lib/push/web-push";
import { enqueueNotification, isQueueConfigured } from "@/lib/queue/notifications";

/** Kirim notifikasi uji lewat outbox + worker yang sama dengan kejadian bisnis. */
export const POST = withRoute(async () => {
  const user = await requireApiUser(["buyer", "agent", "admin"]);

  if (!isPushConfigured()) {
    throw new AppError(ERROR_CODES.NOT_CONFIGURED, "VAPID belum dikonfigurasi di server.", {
      status: 503,
    });
  }

  const db = getDb();
  const subscriptions = await db.pushSubscription.count({
    where: { userId: user.id, revokedAt: null },
  });

  const notification = await db.notification.create({
    data: {
      userId: user.id,
      type: "TEST",
      title: "Notifikasi uji SANG Group",
      body: `Halo ${user.fullName}, jalur Web Push berfungsi. ${subscriptions} perangkat terdaftar.`,
      url: "/akun",
      dedupeKey: `push-test:${user.id}:${Date.now()}`,
    },
    select: { id: true },
  });

  const queued = await enqueueNotification(notification.id);

  return ok({
    notificationId: notification.id,
    subscriptions,
    queued: queued && isQueueConfigured(),
    message: queued
      ? "Notifikasi masuk antrean. Worker akan mengirimnya."
      : "Notifikasi disimpan pending. Jalankan Redis + worker untuk mengirim.",
  });
});
