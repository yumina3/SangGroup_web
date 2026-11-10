"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { isAppError } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { passwordChangeSchema, profileUpdateSchema } from "@/lib/validators/domain";

/** Simpan profil agen (nama, WhatsApp). */
export async function updateProfileAction(input) {
  const user = await getCurrentUser();
  if (!user || user.role !== "agent") {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali.", fieldErrors: {} };
  }

  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path?.join(".") || "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, formError: "Periksa kembali isian profil.", fieldErrors };
  }

  try {
    await getDb().profile.update({
      where: { id: user.id },
      data: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone ?? null,
      },
    });

    const supabase = await createSupabaseServerClient();
    await supabase.auth.updateUser({
      data: { full_name: parsed.data.fullName, phone: parsed.data.phone ?? null },
    });

    revalidatePath("/dashboard/penjual/pengaturan");
    revalidatePath("/dashboard/penjual");
    return { ok: true };
  } catch (error) {
    if (isAppError(error)) {
      return { ok: false, formError: error.message, fieldErrors: error.fieldErrors ?? {} };
    }
    throw error;
  }
}

/**
 * Ganti kata sandi lewat Supabase Auth.
 * Kata sandi lama diverifikasi dengan mencoba sign-in (Supabase tidak punya
 * endpoint "verify current password" terpisah).
 */
export async function changePasswordAction(input) {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, formError: "Sesi berakhir. Silakan masuk kembali.", fieldErrors: {} };
  }

  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path?.join(".") || "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, formError: "Periksa kembali isian kata sandi.", fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    return {
      ok: false,
      formError: "Kata sandi saat ini tidak sesuai.",
      fieldErrors: { currentPassword: "Kata sandi saat ini tidak sesuai" },
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) {
    return { ok: false, formError: error.message, fieldErrors: {} };
  }

  return { ok: true };
}
