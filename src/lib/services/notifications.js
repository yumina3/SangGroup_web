import "server-only";

import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { enqueueNotification } from "@/lib/queue/notifications";
import { serializeNotification } from "@/lib/serializers";

/**
 * Outbox notifikasi.
 *
 * Notifikasi ditulis ke `notifications` di transaksi bisnis yang sama, lalu
 * di-enqueue SETELAH commit. Bila Redis mati, transaksi tetap berhasil dan
 * worker menyapu notifikasi PENDING (lihat worker/index.mjs).
 */

export const NOTIFICATION_TYPES = {
  PROPERTY_SUBMITTED: "PROPERTY_SUBMITTED",
  PROPERTY_VERIFIED: "PROPERTY_VERIFIED",
  PROPERTY_REJECTED: "PROPERTY_REJECTED",
  INQUIRY_CREATED: "INQUIRY_CREATED",
  INQUIRY_STATUS: "INQUIRY_STATUS",
  INQUIRY_CANCELLED: "INQUIRY_CANCELLED",
  MESSAGE_RECEIVED: "MESSAGE_RECEIVED",
  CONTACT_STATUS: "CONTACT_STATUS",
  TASK_DUE: "TASK_DUE",
};

/**
 * Tambah satu baris outbox di dalam transaksi.
 * `dedupeKey` unik: kejadian yang sama tidak menghasilkan notifikasi ganda.
 *
 * @param {any} tx Prisma transaction client
 * @param {{ userId: string, type: string, title: string, body: string, url: string, dedupeKey: string }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function createNotification(tx, input) {
  try {
    return await tx.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title.slice(0, 160),
        body: input.body.slice(0, 500),
        url: input.url.startsWith("/") ? input.url : "/",
        dedupeKey: input.dedupeKey,
      },
      select: { id: true },
    });
  } catch (error) {
    // P2002 = dedupe key sudah ada (kejadian yang sama pernah dicatat).
    if (error?.code === "P2002") return null;
    throw error;
  }
}

/**
 * Buat notifikasi untuk banyak penerima (mis. seluruh admin).
 *
 * @param {any} tx
 * @param {string[]} userIds
 * @param {(userId: string) => object} build
 */
export async function createNotificationsFor(tx, userIds, build) {
  const created = [];
  for (const userId of userIds) {
    const row = await createNotification(tx, { ...build(userId), userId });
    if (row) created.push(row.id);
  }
  return created;
}

/** Enqueue setelah transaksi sukses. Aman dipanggil untuk array kosong. */
export async function enqueueAll(notificationIds) {
  for (const id of notificationIds) {
    await enqueueNotification(id);
  }
}

/** Daftar notifikasi pengguna, terbaru dulu. */
export async function listNotifications(userId, { page = 1, pageSize = 20, unreadOnly = false } = {}) {
  const db = getDb();
  const where = { userId, ...(unreadOnly ? { readAt: null } : {}) };

  const [rows, total, unread] = await db.$transaction([
    db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.notification.count({ where }),
    db.notification.count({ where: { userId, readAt: null } }),
  ]);

  return {
    items: rows.map(serializeNotification),
    total,
    unread,
    page,
    pageSize,
  };
}

/** Tandai satu notifikasi sudah dibaca; hanya pemiliknya yang boleh. */
export async function markNotificationRead(userId, notificationId) {
  const db = getDb();
  const result = await db.notification.updateMany({
    where: { id: notificationId, userId },
    data: { readAt: new Date() },
  });
  if (result.count === 0) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Notifikasi tidak ditemukan.", { status: 404 });
  }
}

export async function markAllNotificationsRead(userId) {
  const db = getDb();
  const result = await db.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  return result.count;
}

/** Simpan/segarkan langganan Web Push milik pengguna. */
export async function savePushSubscription(userId, { endpoint, keys, userAgent }) {
  const db = getDb();
  return db.pushSubscription.upsert({
    where: { endpoint },
    create: {
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent: userAgent ?? null,
    },
    update: {
      userId,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent: userAgent ?? null,
      revokedAt: null,
    },
    select: { id: true, endpoint: true },
  });
}

/** Cabut langganan (hanya milik pengguna yang sedang login). */
export async function removePushSubscription(userId, endpoint) {
  const db = getDb();
  const result = await db.pushSubscription.updateMany({
    where: { userId, endpoint },
    data: { revokedAt: new Date() },
  });
  return result.count > 0;
}

export async function listActiveSubscriptions(userId) {
  const db = getDb();
  return db.pushSubscription.findMany({
    where: { userId, revokedAt: null },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });
}
