import "server-only";

import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma dipakai hanya di server. Sampai DATABASE_URL tersedia, aplikasi tetap
 * berjalan dan modul yang membutuhkan data menampilkan keadaan "belum
 * dikonfigurasi" alih-alih gagal total.
 */

const globalForPrisma = globalThis;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL belum dikonfigurasi");
  }

  if (!globalForPrisma.__sangPrisma) {
    globalForPrisma.__sangPrisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return globalForPrisma.__sangPrisma;
}
