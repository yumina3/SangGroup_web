"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { isAppError } from "@/lib/errors";
import { createStaffUser, updateUser } from "@/lib/services/admin";
import { createCategory, updateCategory } from "@/lib/services/categories";
import { updateInquiryStatus } from "@/lib/services/inquiries";
import { createProject, updateProject } from "@/lib/services/projects";
import { verifyProperty } from "@/lib/services/properties";
import {
  categorySchema,
  categoryUpdateSchema,
  inquiryStatusSchema,
  projectSchema,
  projectUpdateSchema,
  staffCreateSchema,
  userUpdateSchema,
  verificationSchema,
} from "@/lib/validators/domain";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

function toFieldErrors(error) {
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path?.join(".") || "_";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/** Setujui / tolak listing (FR-39). */
export async function verifyPropertyAction(propertyId, decision, note = "") {
  const user = await requireAdmin();
  if (!user) return { ok: false, formError: "Hanya admin yang boleh memverifikasi listing." };

  const parsed = verificationSchema.safeParse({ decision, note });
  if (!parsed.success) {
    return { ok: false, formError: parsed.error.issues[0]?.message ?? "Keputusan tidak valid." };
  }

  try {
    await verifyProperty(user.id, propertyId, parsed.data);
    revalidatePath("/admin");
    revalidatePath("/admin/properti");
    revalidatePath("/dashboard/penjual/properti");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

/** Tambah/ubah kategori (FR-40). */
export async function saveCategoryAction(input) {
  const user = await requireAdmin();
  if (!user) return { ok: false, formError: "Hanya admin." };

  try {
    if (input?.id) {
      const parsed = categoryUpdateSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          formError: "Periksa isian kategori.",
          fieldErrors: toFieldErrors(parsed.error),
        };
      }
      await updateCategory(input.id, parsed.data);
    } else {
      const parsed = categorySchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          formError: "Periksa isian kategori.",
          fieldErrors: toFieldErrors(parsed.error),
        };
      }
      await createCategory(parsed.data);
    }
    revalidatePath("/admin/kategori");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

/** Tambah/ubah proyek (FR-40). */
export async function saveProjectAction(input) {
  const user = await requireAdmin();
  if (!user) return { ok: false, formError: "Hanya admin." };

  try {
    if (input?.id) {
      const parsed = projectUpdateSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          formError: "Periksa isian proyek.",
          fieldErrors: toFieldErrors(parsed.error),
        };
      }
      await updateProject(input.id, parsed.data);
    } else {
      const parsed = projectSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          formError: "Periksa isian proyek.",
          fieldErrors: toFieldErrors(parsed.error),
        };
      }
      await createProject(parsed.data);
    }
    revalidatePath("/admin/proyek");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

/** Ubah role/status pengguna (FR-41). */
export async function updateUserAction(userId, patch) {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, formError: "Hanya admin." };

  const parsed = userUpdateSchema.safeParse(patch);
  if (!parsed.success) {
    return { ok: false, formError: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateUser(admin.id, userId, parsed.data);
    revalidatePath("/admin/pengguna");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

/** Buat akun staf agen/admin (FR-41). */
export async function createStaffAction(input) {
  const user = await requireAdmin();
  if (!user) return { ok: false, formError: "Hanya admin." };

  const parsed = staffCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      formError: "Periksa isian akun.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const created = await createStaffUser(parsed.data);
    revalidatePath("/admin/pengguna");
    return { ok: true, created };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}

/** Admin menindaklanjuti pengajuan (FR-42, VL-18). */
export async function updateInquiryStatusAction(inquiryId, input) {
  const user = await requireAdmin();
  if (!user) return { ok: false, formError: "Hanya admin." };

  const parsed = inquiryStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, formError: parsed.error.issues[0]?.message ?? "Status tidak valid." };
  }

  try {
    await updateInquiryStatus(user, inquiryId, parsed.data);
    revalidatePath("/admin/pengajuan");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) return { ok: false, formError: error.message };
    throw error;
  }
}
