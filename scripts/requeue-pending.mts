/**
 * Masukkan ulang notifikasi PENDING ke antrean (mis. Redis sempat mati saat
 * kejadian bisnis terjadi).
 *
 *   npm run notifications:requeue
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { Queue } from "bullmq";
import IORedis from "ioredis";

import { PrismaClient } from "../src/generated/prisma/client.ts";

try {
  process.loadEnvFile?.(".env");
} catch {
  // abaikan
}

if (!process.env.DATABASE_URL || !process.env.REDIS_URL) {
  console.error("DATABASE_URL dan REDIS_URL harus diisi.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
const queue = new Queue("notifications", { connection });

const pending = await prisma.notification.findMany({
  where: { status: "pending", attempts: { lt: 5 } },
  orderBy: { createdAt: "asc" },
  select: { id: true, createdAt: true },
});

let queued = 0;
for (const item of pending) {
  await queue.add(
    "deliver",
    { notificationId: item.id },
    { jobId: `notification:${item.id}`, attempts: 5, backoff: { type: "exponential", delay: 5000 } },
  );
  queued += 1;
}

console.log(`Ditemukan ${pending.length} notifikasi PENDING, ${queued} dimasukkan ke antrean.`);

await queue.close();
await connection.quit();
await prisma.$disconnect();
