"use client";

import { useCallback, useState } from "react";

/**
 * Tombol aktivasi Web Push.
 *
 * Izin notifikasi HANYA diminta setelah pengguna menekan tombol (bukan saat
 * halaman dimuat), sesuai aturan browser. Semua kondisi gagal ditangani
 * eksplisit: browser tidak mendukung, izin ditolak, VAPID belum dikonfigurasi,
 * dan subscription gagal disimpan.
 */

function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) output[index] = raw.charCodeAt(index);
  return output;
}

export default function PushNotifications({ compact = false }) {
  const [status, setStatus] = useState("idle");
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState("");

  const subscribe = useCallback(async () => {
    setStatus("working");
    setMessage("");

    if (!pushSupported()) {
      setStatus("error");
      setMessage("Browser ini tidak mendukung Web Push. Gunakan Chrome/Firefox/Edge terbaru.");
      return;
    }

    try {
      if (Notification.permission === "denied") {
        setBlocked(true);
        setStatus("error");
        setMessage("Izin notifikasi diblokir. Aktifkan lewat pengaturan situs di browser.");
        return;
      }

      const permissionResult = await Notification.requestPermission();
      if (permissionResult !== "granted") {
        setStatus("error");
        setMessage("Izin notifikasi ditolak. Aktifkan lewat pengaturan situs di browser.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const keyResponse = await fetch("/api/push/public-key", { cache: "no-store" });
      const keyPayload = await keyResponse.json();
      const publicKey = keyPayload?.data?.publicKey;
      if (!keyResponse.ok || !publicKey) {
        setStatus("error");
        setMessage("VAPID belum dikonfigurasi di server. Hubungi admin.");
        return;
      }

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const json = subscription.toJSON();
      const response = await fetch("/api/push/subscriptions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(payload?.error?.message ?? "Subscription gagal disimpan.");
        return;
      }

      setStatus("subscribed");
      setMessage("Notifikasi aktif di perangkat ini.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error?.message?.includes("applicationServerKey")
          ? "Kunci VAPID tidak valid. Hubungi admin."
          : "Gagal mengaktifkan notifikasi. Coba lagi.",
      );
    }
  }, []);

  const sendTest = useCallback(async () => {
    setStatus("working");
    setMessage("");
    try {
      const response = await fetch("/api/push/test", { method: "POST" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus("error");
        setMessage(payload?.error?.message ?? "Gagal mengirim notifikasi uji.");
        return;
      }
      setStatus("subscribed");
      setMessage(payload?.data?.message ?? "Notifikasi uji dikirim.");
    } catch {
      setStatus("error");
      setMessage("Gagal menghubungi server.");
    }
  }, []);

  const busy = status === "working";

  return (
    <div className={compact ? "flex flex-wrap items-center gap-2" : "space-y-2"}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={subscribe}
          disabled={busy || blocked}
          className="rounded-lg border border-ag-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ag-slate transition-colors hover:bg-ag-surface-low disabled:cursor-not-allowed disabled:opacity-60"
        >
          {blocked
            ? "Notifikasi diblokir browser"
            : status === "subscribed"
              ? "Notifikasi aktif"
              : busy
                ? "Menyiapkan…"
                : "Aktifkan notifikasi"}
        </button>

        {status === "subscribed" ? (
          <button
            type="button"
            onClick={sendTest}
            disabled={busy}
            className="rounded-lg bg-ag-forest px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-ag-forest-medium disabled:opacity-60"
          >
            Kirim notifikasi uji
          </button>
        ) : null}
      </div>

      {message ? (
        <p
          role="status"
          className={`text-[11.5px] leading-relaxed ${
            status === "error" ? "text-[#9b2c2c]" : "text-ag-slate-secondary"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
