/**
 * Background worker: pengiriman Web Push.
 *
 * Dijalankan terpisah dari aplikasi Next.js:
 *   npm run worker
 *
 * Alur: Route Handler / Server Action menulis baris `notifications` (outbox)
 * lalu memasukkan id-nya ke antrean BullMQ. Worker ini mengambil job,
 * mengirim Web Push ke seluruh subscription aktif pengguna, mencatat hasilnya,
 * dan mencabut subscription yang sudah tidak valid (404/410).
 *
 * Catatan implementasi:
 * - Prisma Client 7 membutuhkan driver adapter; worker membuat instance sendiri
 *   (tidak memakai alias "@/..." karena berjalan di luar bundler Next).
 * - Job memakai jobId = id notifikasi sehingga aman dari pengiriman ganda.
 * - Sweep berkala menyapu notifikasi PENDING yang gagal masuk antrean saat
 *   Redis sempat mati; ini yang membuat kegagalan enqueue tidak diam-diam.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import pino from "pino";
import webpush from "web-push";

import { PrismaClient } from "../src/generated/prisma/client.ts";

try {
  // Node 24: memuat .env tanpa dependensi tambahan (abaikan bila tidak ada).
  process.loadEnvFile?.(".env");
} catch {
  // .env opsional; variabel bisa datang dari environment proses.
}

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "sang-worker" },
  timestamp: pino.stdTimeFunctions.isoTime,
});

const QUEUE_NAME = "notifications";
const SWEEP_INTERVAL_MS = 60_000;
const MAX_ATTEMPTS = 5;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    logger.fatal({ event: "worker.env_missing", name }, `Variabel ${name} belum diisi`);
    process.exit(1);
  }
  return value;
}

const databaseUrl = requireEnv("DATABASE_URL");
const redisUrl = requireEnv("REDIS_URL");

if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  logger.fatal(
    { event: "worker.vapid_missing" },
    "NEXT_PUBLIC_VAPID_PUBLIC_KEY dan VAPID_PRIVATE_KEY wajib diisi",
  );
  process.exit(1);
}

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@sanggroup.id",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
  log: ["warn", "error"],
});

const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
const queue = new Queue(QUEUE_NAME, { connection });

/**
 * Kirim satu notifikasi ke semua subscription aktif pemiliknya.
 * @param {import("bullmq").Job} job
 */
async function deliver(job) {
  const startedAt = Date.now();
  const notificationId = job.data?.notificationId;

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    logger.warn({ event: "worker.notification_missing", notificationId }, "Notifikasi tidak ada");
    return { skipped: "missing" };
  }
  if (notification.status !== "pending") {
    return { skipped: notification.status };
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: notification.userId, revokedAt: null },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });

  if (subscriptions.length === 0) {
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: "skipped",
        attempts: { increment: 1 },
        lastError: "Pengguna belum memiliki subscription Web Push aktif",
      },
    });
    logger.info(
      { event: "worker.skipped", notificationId: notification.id, reason: "no_subscription" },
      "Tidak ada subscription aktif",
    );
    return { skipped: "no_subscription" };
  }

  let sent = 0;
  let gone = 0;
  let failed = 0;
  let lastError = null;

  const payload = JSON.stringify({
    title: notification.title,
    body: notification.body,
    url: notification.url,
    tag: notification.id,
  });

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        },
        payload,
        { TTL: 3600, urgency: "normal" },
      );
      sent += 1;
      await prisma.pushSubscription.update({
        where: { id: subscription.id },
        data: { lastSuccessAt: new Date() },
      });
    } catch (error) {
      const statusCode = error?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        gone += 1;
        await prisma.pushSubscription.update({
          where: { id: subscription.id },
          data: { revokedAt: new Date() },
        });
        logger.warn(
          { event: "worker.subscription_revoked", subscriptionId: subscription.id, statusCode },
          "Subscription tidak valid, dicabut",
        );
      } else {
        failed += 1;
        lastError = `Push gagal (${statusCode ?? "tanpa status"}): ${error?.message ?? "unknown"}`;
        logger.warn(
          {
            event: "worker.push_failed",
            subscriptionId: subscription.id,
            statusCode,
            err: error?.message,
          },
          "Pengiriman ke satu subscription gagal",
        );
      }
    }
  }

  const durationMs = Date.now() - startedAt;

  if (sent > 0) {
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: "sent",
        sentAt: new Date(),
        attempts: { increment: 1 },
        lastError: failed > 0 ? lastError : null,
      },
    });
    logger.info(
      {
        event: "worker.sent",
        notificationId: notification.id,
        userId: notification.userId,
        sent,
        failed,
        gone,
        durationMs,
      },
      "Notifikasi terkirim",
    );
    return { sent, failed, gone };
  }

  if (gone === subscriptions.length) {
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: "skipped",
        attempts: { increment: 1 },
        lastError: "Semua subscription sudah tidak valid",
      },
    });
    logger.warn(
      { event: "worker.all_gone", notificationId: notification.id, gone },
      "Semua subscription tidak valid",
    );
    return { skipped: "all_subscriptions_gone" };
  }

  // Kegagalan sementara: biarkan BullMQ mencoba ulang sesuai backoff.
  await prisma.notification.update({
    where: { id: notification.id },
    data: { attempts: { increment: 1 }, lastError },
  });

  throw new Error(lastError ?? "Pengiriman Web Push gagal");
}

const worker = new Worker(QUEUE_NAME, deliver, {
  connection,
  concurrency: 5,
  lockDuration: 30_000,
});

worker.on("completed", (job) => {
  logger.debug({ event: "worker.job_completed", jobId: job.id }, "Job selesai");
});

worker.on("failed", async (job, error) => {
  const attemptsMade = job?.attemptsMade ?? 0;
  const maxAttempts = job?.opts?.attempts ?? MAX_ATTEMPTS;
  logger.error(
    {
      event: "worker.job_failed",
      jobId: job?.id,
      notificationId: job?.data?.notificationId,
      attemptsMade,
      maxAttempts,
      err: error?.message,
    },
    "Job notifikasi gagal",
  );

  if (job?.data?.notificationId && attemptsMade >= maxAttempts) {
    await prisma.notification
      .update({
        where: { id: job.data.notificationId },
        data: { status: "failed", lastError: String(error?.message ?? "gagal").slice(0, 300) },
      })
      .catch(() => {});
  }
});

worker.on("error", (error) => {
  logger.error({ event: "worker.error", err: error?.message }, "Worker error");
});

/**
 * Sapu notifikasi PENDING yang belum masuk antrean (mis. Redis sempat mati)
 * dan bersihkan sesi kedaluwarsa.
 */
async function sweep() {
  const threshold = new Date(Date.now() - 60_000);
  const pending = await prisma.notification.findMany({
    where: { status: "pending", createdAt: { lt: threshold }, attempts: { lt: MAX_ATTEMPTS } },
    orderBy: { createdAt: "asc" },
    take: 50,
    select: { id: true },
  });

  for (const item of pending) {
    await queue.add(
      "deliver",
      { notificationId: item.id },
      { jobId: `notification:${item.id}`, attempts: MAX_ATTEMPTS },
    );
  }

  const cleaned = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  logger.info(
    {
      event: "worker.sweep",
      requeued: pending.length,
      expiredSessionsDeleted: cleaned.count,
    },
    "Sweep selesai",
  );
}

const sweepTimer = setInterval(() => {
  sweep().catch((error) => {
    logger.error({ event: "worker.sweep_failed", err: error?.message }, "Sweep gagal");
  });
}, SWEEP_INTERVAL_MS);

logger.info(
  { event: "worker.started", queue: QUEUE_NAME, concurrency: 5 },
  "Worker Web Push berjalan",
);

// Jalankan sweep pertama segera setelah start.
sweep().catch((error) => {
  logger.warn({ event: "worker.sweep_initial_failed", err: error?.message }, "Sweep awal gagal");
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ event: "worker.shutdown", signal }, "Menghentikan worker…");

  clearInterval(sweepTimer);
  await worker.close().catch(() => {});
  await queue.close().catch(() => {});
  await connection.quit().catch(() => {});
  await prisma.$disconnect().catch(() => {});
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
