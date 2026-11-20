"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { isAppError } from "@/lib/errors";
import { sellerTransition } from "@/lib/services/inquiries";

const LEGACY_ACTIONS = ["CONFIRMED", "RESCHEDULED", "REJECTED", "COMPLETED"];

/**
 * Tindak lanjut pengajuan dari UI dashboard lama.
 * Status lama dipetakan ke status SRS di service (CONFIRMED→dihubungi, dst).
 */
export async function respondInquiryAction({ inquiryId, next, note }) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "agent" && user.role !== "admin")) {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali.", fieldErrors: {} };
  }

  if (!LEGACY_ACTIONS.includes(next)) {
    return { ok: false, formError: "Status tindak lanjut tidak dikenal.", fieldErrors: {} };
  }

  const trimmed = String(note ?? "").trim();
  if (trimmed.length < 5 || trimmed.length > 280) {
    return {
      ok: false,
      formError: "Catatan tindak lanjut wajib 5–280 karakter.",
      fieldErrors: { note: "Catatan 5–280 karakter" },
    };
  }

  try {
    const inquiry = await sellerTransition(user.id, inquiryId, { next, note: trimmed });
    revalidatePath("/dashboard/penjual/pengajuan");
    revalidatePath("/dashboard/penjual");
    return { ok: true, inquiry };
  } catch (error) {
    if (isAppError(error)) {
      return { ok: false, formError: error.message, fieldErrors: error.fieldErrors ?? {} };
    }
    throw error;
  }
}
