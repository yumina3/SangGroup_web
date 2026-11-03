import { SELLER_INQUIRY_ACTIONS } from "@/lib/dashboard/status-labels";

/**
 * Aturan tindak lanjut pengajuan penjual.
 *
 * Semua perubahan status pengajuan harus punya alasan tertulis (SRS-F-SEL-10),
 * dan tindakan yang menjadwalkan ulang wajib menyebut tanggal kunjungan baru.
 * Aturan ini dipakai dialog penjual sekarang, dan dipakai ulang oleh Server
 * Action saat penyimpanan disambungkan agar klien dan server sepakat.
 */

export const FOLLOW_UP_NOTE_MAX = 280;
export const FOLLOW_UP_NOTE_MIN = 5;

/** Status yang memerlukan tanggal kunjungan baru. */
export const RESCHEDULE_STATUS = "RESCHEDULED";

/**
 * Apakah transisi PENDING→…/…→COMPLETED boleh dilakukan penjual.
 * Matriks transisi tunggal ada di `SELLER_INQUIRY_ACTIONS` (SRS §6.8).
 */
export function isAllowedTransition(from, to) {
  return (SELLER_INQUIRY_ACTIONS[from] ?? []).includes(to);
}

/**
 * Validasi catatan tindak lanjut.
 * @returns {{ ok: true, note: string } | { ok: false, message: string }}
 */
export function validateFollowUp({ next, note, scheduledAt }) {
  const trimmed = String(note ?? "").trim();

  if (trimmed.length < FOLLOW_UP_NOTE_MIN) {
    return {
      ok: false,
      message: `Catatan minimal ${FOLLOW_UP_NOTE_MIN} karakter agar pembeli tahu alasannya.`,
    };
  }

  if (next === RESCHEDULE_STATUS) {
    const date = scheduledAt ? new Date(scheduledAt) : null;
    if (!date || Number.isNaN(date.getTime())) {
      return { ok: false, message: "Jadwal ulang wajib menyebutkan tanggal kunjungan baru." };
    }
    if (date.getTime() < Date.now()) {
      return { ok: false, message: "Tanggal kunjungan baru tidak boleh di masa lalu." };
    }
  }

  return { ok: true, note: trimmed };
}

/**
 * Nomor WhatsApp yang aman dipakai sebagai tautan wa.me: hanya digit,
 * ditambah awalan negara bila diawali 0 (nomor Indonesia).
 */
export function waNumber(phone) {
  const digits = String(phone ?? "").replace(/[^\d]/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

/** Teks awal pesan WhatsApp agar pembeli tahu konteksnya. */
export function waMessage(inquiry) {
  return `Halo ${inquiry.buyer.name}, saya agen Sang Group mengenai ${inquiry.property.title}.`;
}
