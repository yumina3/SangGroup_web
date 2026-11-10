"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { isAppError } from "@/lib/errors";
import {
  createProperty,
  deleteProperty,
  resubmitProperty,
  updateBusinessStatus,
  updateProperty,
} from "@/lib/services/properties";
import { propertyCreateSchema, propertyUpdateSchema } from "@/lib/validators/domain";

/**
 * Server Action penyimpanan listing (SRS §4.1).
 * Validasi klien hanya untuk pesan cepat; skema Zod di server adalah sumber
 * kebenaran, constraint database menjadi lapisan ketiga.
 */
export async function savePropertyAction({ mode, propertyId, values }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "agent") {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali.", fieldErrors: {} };
  }

  const schema = mode === "create" ? propertyCreateSchema : propertyUpdateSchema;
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path?.join(".") || "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, formError: "Sebagian isian belum benar.", fieldErrors };
  }

  try {
    const property =
      mode === "create"
        ? await createProperty(user.id, parsed.data)
        : await updateProperty(user.id, propertyId, parsed.data);

    revalidatePath("/dashboard/penjual/properti");
    revalidatePath("/dashboard/penjual");
    return { ok: true, property };
  } catch (error) {
    if (isAppError(error)) {
      return { ok: false, formError: error.message, fieldErrors: error.fieldErrors ?? {} };
    }
    throw error;
  }
}

/** Kirim ulang listing yang ditolak ke verifikasi. */
export async function submitPropertyAction(propertyId) {
  const user = await getCurrentUser();
  if (!user || user.role !== "agent") {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali." };
  }

  try {
    await resubmitProperty(user.id, propertyId);
    revalidatePath("/dashboard/penjual/properti");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

const LEGACY_SALE_TO_SRS = { AVAILABLE: "tersedia", BOOKED: "dipesan", SOLD: "terjual" };

/** Ubah status bisnis unit (dipanggil UI dengan label lama). */
export async function changeSaleStatusAction(propertyId, saleStatus) {
  const user = await getCurrentUser();
  if (!user || user.role !== "agent") {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali." };
  }

  const status = LEGACY_SALE_TO_SRS[saleStatus] ?? saleStatus;
  try {
    await updateBusinessStatus(user.id, propertyId, status);
    revalidatePath("/dashboard/penjual/properti");
    revalidatePath("/dashboard/penjual");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

/** Hapus listing (hanya pending/rejected tanpa pengajuan). */
export async function deletePropertyAction(propertyId) {
  const user = await getCurrentUser();
  if (!user || user.role !== "agent") {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali." };
  }

  try {
    await deleteProperty(user.id, propertyId);
    revalidatePath("/dashboard/penjual/properti");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}
