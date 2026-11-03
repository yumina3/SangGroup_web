"use client";

import { useActionState } from "react";
import Link from "next/link";

import Alert from "@/components/ui/Alert";
import Field from "@/components/ui/Field";
import SubmitButton from "@/components/ui/SubmitButton";
import { loginAction } from "@/app/(auth)/login/actions";

const initialState = { ok: false, formError: null, fieldErrors: {} };

export default function LoginForm({ next }) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />

      {state?.formError ? <Alert tone="danger">{state.formError}</Alert> : null}

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
        label="Kata sandi"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        error={fieldErrors.password}
      />

      <SubmitButton pendingLabel="Memeriksa…">Masuk</SubmitButton>

      <p className="text-center text-[13px] text-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-brand underline underline-offset-2">
          Daftar sebagai pembeli
        </Link>
      </p>
    </form>
  );
}
