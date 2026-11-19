import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

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
    // Prisma 7 memakai driver adapter; tanpa ini PrismaClient tidak bisa
    // membuka koneksi sama sekali. `pg` dipakai sebagai driver PostgreSQL.
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

    globalForPrisma.__sangPrisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return globalForPrisma.__sangPrisma;
}
