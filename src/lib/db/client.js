import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import { PrismaClient } from "@/generated/prisma/client";
import { logger } from "@/lib/logging/logger";

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
    const adapter = new PrismaPg(createPool(), {
      // Nama prepared statement harus unik global, bukan hanya unik per
      // transaksi. Tanpa ini dua transaksi paralel yang menjalankan SQL
      // identik memakai nama yang sama dan PostgreSQL menolaknya dengan
      // "prepared statement already exists".
      statementNameGenerator: (query) =>
        `sang_${(globalForPrisma.__sangStatementSeq += 1)}_${hashQuery(query.sql)}`,
    });

    globalForPrisma.__sangPrisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return globalForPrisma.__sangPrisma;
}

globalForPrisma.__sangStatementSeq ??= 0;

/**
 * Satu pool per proses. Pool di-cache global supaya hot reload dev server
 * tidak menumpuk koneksi, dan dipakai bersama Prisma agar batas koneksi hanya
 * satu (default `pg` = 10).
 */
function createPool() {
  if (!globalForPrisma.__sangPgPool) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    // Tanpa listener `error`, koneksi idle yang putus bisa mematikan proses.
    pool.on("error", (error) => {
      logger.warn(
        { event: "db.pool_idle_error", err: error?.message },
        "Koneksi idle PostgreSQL terputus",
      );
    });
    globalForPrisma.__sangPgPool = pool;
  }

  return globalForPrisma.__sangPgPool;
}

/** Hash pendek deterministik supaya nama statement tetap stabil per SQL. */
function hashQuery(sql) {
  let hash = 0;
  for (let index = 0; index < sql.length; index += 1) {
    hash = (hash * 31 + sql.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}
