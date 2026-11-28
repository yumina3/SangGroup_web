import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Membaca environment variables dari .env.local
loadEnv({ path: ".env.local" });

// Fallback jika ada environment variable di .env
loadEnv({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // Migrasi & status harus lewat session-mode pooler (port 5432).
    // DATABASE_URL memakai transaction-mode pooler (port 6543 + pgbouncer=true)
    // yang tidak mendukung prepared statement / advisory lock panjang sehingga
    // Prisma CLI menggantung tanpa output. DIRECT_URL dipakai bila tersedia,
    // dengan DATABASE_URL sebagai fallback.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
