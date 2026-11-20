"use client";

import { useActionState, useState } from "react";

import Alert from "@/components/ui/Alert";
import Field from "@/components/ui/Field";
import SubmitButton from "@/components/ui/SubmitButton";
import { IconEye, IconEyeOff } from "@/components/dashboard/icons";
import { penjualLoginAction } from "@/app/penjual/actions";

const initialState = { ok: false, formError: null, fieldErrors: {} };

/**
 * Form login agen untuk halaman /penjual (gerbang sebelum dashboard).
 *
 * Kata sandi dikendalikan state agar tombol "lihat sandi" dan pengosongan
 * otomatis setelah percobaan gagal bisa dilakukan. E-mail yang diketik tetap
 * tersimpan supaya pengguna tidak mengetik ulang.
 */
export default function PenjualLoginForm() {
  const [state, formAction] = useActionState(penjualLoginAction, initialState);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state?.formError ? <Alert tone="danger">{state.formError}</Alert> : null}

      <Field
        label="Email agen"
        name="email"
        type="email"
        autoComplete="username"
        required
        placeholder="nama@sanggroup.id"
        error={fieldErrors.email}
      />

      <div className="relative">
        <Field
          label="Kata sandi"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-pressed={showPassword}
          className="absolute right-2 top-[26px] flex h-8 w-9 items-center justify-center rounded-md text-muted hover:bg-brand-cream hover:text-brand-ink"
        >
          {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          <span className="sr-only">{showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}</span>
        </button>
      </div>

      <SubmitButton pendingLabel="Memeriksa…">Masuk ke dashboard</SubmitButton>
    </form>
  );
}
