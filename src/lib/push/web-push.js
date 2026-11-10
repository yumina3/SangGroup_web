import webpush from "web-push";

import { logger } from "@/lib/logging/logger";

/**
 * Konfigurasi VAPID dan pengiriman Web Push.
 *
 * Private key hanya hidup di server (env VAPID_PRIVATE_KEY). Modul ini dipakai
 * Route Handler (kirim tes/subscribe) dan worker (pengiriman massal).
 */

let configured = false;

export function isPushConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
  );
}

export function getVapidPublicKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
}

export function configureWebPush() {
  if (!isPushConfigured()) {
    throw new Error("VAPID belum dikonfigurasi: isi NEXT_PUBLIC_VAPID_PUBLIC_KEY dan VAPID_PRIVATE_KEY");
  }
  if (!configured) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:admin@sanggroup.id",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
    configured = true;
  }
  return webpush;
}

/**
 * Kirim satu notifikasi. Error dari web-push dibiarkan naik agar worker bisa
 * membedakan subscription mati (404/410) dari kegagalan sementara.
 *
 * @param {{ endpoint: string, p256dh: string, auth: string }} subscription
 * @param {{ title: string, body: string, url: string, tag?: string }} payload
 */
export async function sendPush(subscription, payload) {
  const client = configureWebPush();
  return client.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url,
      tag: payload.tag ?? undefined,
    }),
    { TTL: 3600, urgency: "normal" },
  );
}

/** Subscription dianggap mati bila push service membalas 404/410. */
export function isGoneError(error) {
  return error?.statusCode === 404 || error?.statusCode === 410;
}

export function pushLogger() {
  return logger;
}
