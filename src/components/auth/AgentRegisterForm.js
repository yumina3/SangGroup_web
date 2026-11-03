"use client";

import { useActionState } from "react";
import Link from "next/link";

import Alert from "@/components/ui/Alert";
import Field from "@/components/ui/Field";
import SubmitButton from "@/components/ui/SubmitButton";
import { registerAgentAction } from "@/app/(auth)/pasang-properti/actions";

const initialState = { ok: false, formError: null, fieldErrors: {} };

export default function AgentRegisterForm() {
  const [state, formAction] = useActionState(registerAgentAction, initialState);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state?.formError ? <Alert tone="danger">{state.formError}</Alert> : null}

      <Field
        label="Nama lengkap"
        name="fullName"
        autoComplete="name"
        required
        placeholder="Nama sesuai identitas"
        error={fieldErrors.fullName}
      />

      <Field
        label="Nama agen / agensi"
        name="agencyName"
        autoComplete="organization"
        required
        placeholder="Contoh: Sang Group Marketing"
        error={fieldErrors.agencyName}
      />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="nama@email.com"
        error={fieldErrors.email}
      />

      <Field
        label="Nomor WhatsApp"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
        placeholder="08123456789"
        hint="Format 08xx atau +62xx"
        error={fieldErrors.phone}
      />

      <Field
        label="Kata sandi"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="Minimal 8 karakter, kombinasi huruf dan angka"
        error={fieldErrors.password}
      />

      <Field
        label="Konfirmasi kata sandi"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        error={fieldErrors.confirmPassword}
      />

      <SubmitButton pendingLabel="Mengirim pendaftaran…">
        Daftar sebagai agen
      </SubmitButton>

      <p className="text-center text-[13px] text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-brand underline underline-offset-2">
          Masuk
        </Link>
      </p>
    </form>
  );
}
