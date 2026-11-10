import { connection, NextResponse } from "next/server";

import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { withRoute } from "@/lib/http/api";
import { isPushConfigured } from "@/lib/push/web-push";
import { isQueueConfigured } from "@/lib/queue/notifications";
import { isStorageConfigured } from "@/lib/storage/supabase-storage";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const GET = withRoute(async () => {
  await connection();

  let database = "not_configured";
  if (isDatabaseConfigured()) {
    try {
      await getDb().$queryRaw`SELECT 1`;
      database = "ok";
    } catch {
      database = "error";
    }
  }

  return NextResponse.json({
    data: {
      status: database === "ok" ? "ok" : "degraded",
      checks: {
        database,
        auth: isSupabaseConfigured() ? "configured" : "not_configured",
        storage: isStorageConfigured() ? "configured" : "not_configured",
        queue: isQueueConfigured() ? "configured" : "not_configured",
        push: isPushConfigured() ? "configured" : "not_configured",
      },
      time: new Date().toISOString(),
    },
  });
});
