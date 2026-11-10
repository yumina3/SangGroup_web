import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma Client 7 membutuhkan driver adapter (engine bawaan sudah dihapus).
 * Satu instance dipakai ulang di seluruh proses; di mode development instance
 * disimpan di globalThis agar hot reload tidak membuka kolam koneksi baru terus.
 */

const globalForPrisma = globalThis;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export function getDb() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL belum dikonfigurasi");
  }

  if (!globalForPrisma.__sangPrisma) {
    globalForPrisma.__sangPrisma = createClient();
  }

  return globalForPrisma.__sangPrisma;
}
