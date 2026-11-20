import { ok, withRoute } from "@/lib/http/api";
import { getVapidPublicKey, isPushConfigured } from "@/lib/push/web-push";

/** Kunci publik VAPID untuk `pushManager.subscribe`. */
export const GET = withRoute(async () => {
  return ok({
    configured: isPushConfigured(),
    publicKey: isPushConfigured() ? getVapidPublicKey() : null,
  });
});
