/* Service Worker: penerima Web Push SANG Group. */
/* eslint-disable no-restricted-globals */

const DEFAULT_TITLE = "SANG Group";
const DEFAULT_URL = "/dashboard/penjual";

self.addEventListener("install", () => {
  // Langsung aktif agar notifikasi bisa diterima tanpa menunggu reload.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/**
 * Terima push dari server.
 * Payload: { title, body, url, tag }
 */
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || DEFAULT_TITLE;
  const options = {
    body: payload.body || "Ada pembaruan dari SANG Group.",
    icon: "/logo_sang.png",
    badge: "/logo_sang.png",
    tag: payload.tag || "sang-group",
    renotify: false,
    data: { url: typeof payload.url === "string" ? payload.url : DEFAULT_URL },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/** Klik notifikasi: fokus tab yang sudah terbuka, atau buka tab baru. */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || DEFAULT_URL, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of clientList) {
        if (client.url === target && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })(),
  );
});

/**
 * Browser memutar ulang subscription (mis. kunci kedaluwarsa).
 * Beri tahu tab yang terbuka agar mengirim subscription baru ke backend.
 */
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of clientList) {
        client.postMessage({ type: "pushsubscriptionchange" });
      }
    })(),
  );
});
