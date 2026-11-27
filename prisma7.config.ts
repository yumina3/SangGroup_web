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
    url: process.env.DATABASE_URL,
  },
});