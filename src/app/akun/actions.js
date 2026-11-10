"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { isAppError } from "@/lib/errors";
import { cancelInquiry } from "@/lib/services/inquiries";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/services/notifications";

/** Pembeli membatalkan pengajuannya (BR-29). */
export async function cancelInquiryAction(inquiryId, reason = "") {
  const user = await getCurrentUser();
  if (!user || user.role !== "buyer") {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali." };
  }

  try {
    await cancelInquiry(user.id, inquiryId, reason);
    revalidatePath("/akun");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

export async function readNotificationAction(notificationId) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, formError: "Sesi berakhir." };

  try {
    await markNotificationRead(user.id, notificationId);
    revalidatePath("/akun");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

export async function readAllNotificationsAction() {
  const user = await getCurrentUser();
  if (!user) return { ok: false, formError: "Sesi berakhir." };

  const updated = await markAllNotificationsRead(user.id);
  revalidatePath("/akun");
  return { ok: true, updated };
}
