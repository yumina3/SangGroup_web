import "server-only";

import { Queue } from "bullmq";
import IORedis from "ioredis";

import { logger } from "@/lib/logging/logger";

/**
 * Antrean notifikasi (BullMQ + Redis).
 *
 * Alur: kejadian bisnis menulis baris `notifications` (outbox) di transaksi
 * yang sama → setelah commit, id baris di-enqueue → worker mengirim Web Push.
 * Job memakai `jobId` = id notifikasi sehingga kejadian yang sama tidak pernah
 * dikirim dua kali meskipun enqueue dipanggil berulang.
 */

export const NOTIFICATION_QUEUE = "notifications";

/** @type {import("ioredis").default | null} */
let redis = null;
/** @type {Queue | null} */
let queue = null;

export function isQueueConfigured() {
  return Boolean(process.env.REDIS_URL);
}

export function getRedis() {
  if (!isQueueConfigured()) return null;
  if (!redis) {
    redis = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
    redis.on("error", (error) => {
      logger.warn({ event: "redis.error", err: error.message }, "Koneksi Redis bermasalah");
    });
  }
  return redis;
}

export function getNotificationQueue() {
  if (!isQueueConfigured()) return null;
  if (!queue) {
    queue = new Queue(NOTIFICATION_QUEUE, {
      connection: getRedis(),
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: "exponential", delay: 5_000 },
        removeOnComplete: { age: 3_600, count: 1_000 },
        removeOnFail: { age: 86_400, count: 5_000 },
      },
    });
  }
  return queue;
}

/**
 * Masukkan satu notifikasi outbox ke antrean.
 *
 * Kegagalan Redis TIDAK boleh membatalkan transaksi bisnis. Notifikasi tetap
 * PENDING di database dan akan disapu ulang oleh worker (sweep) atau skrip
 * `npm run notifications:requeue`.
 *
 * @param {string} notificationId
 * @returns {Promise<boolean>}
 */
export async function enqueueNotification(notificationId) {
  const target = getNotificationQueue();
  if (!target) {
    logger.warn(
      { event: "queue.not_configured", notificationId },
      "REDIS_URL kosong: notifikasi disimpan PENDING dan menunggu worker",
    );
    return false;
  }

  try {
    await target.add(
      "deliver",
      { notificationId },
      { jobId: `notification:${notificationId}` },
    );
    return true;
  } catch (error) {
    logger.error(
      { event: "queue.enqueue_failed", notificationId, err: error?.message },
      "Gagal memasukkan notifikasi ke antrean",
    );
    return false;
  }
}

/** Tutup koneksi (dipakai saat shutdown/test). */
export async function closeQueue() {
  await queue?.close();
  queue = null;
  if (redis) {
    await redis.quit().catch(() => {});
    redis = null;
  }
}
