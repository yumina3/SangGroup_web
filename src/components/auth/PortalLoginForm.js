"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import Alert from "@/components/ui/Alert";

const WA_RESET =
  "https://wa.me/6281234567890?text=Halo%20SANG%20Group%2C%20saya%20lupa%20kata%20sandi%20akun%20saya.";

const initialState = {
  ok: false,
  formError: null,
  fieldErrors: {},
  switchPortal: null,
};

const COPY = {
  buyer: {
    submit: "Masuk ke Dashboard Pembeli",
    passwordPlaceholder: "Masukkan kata sandi akun",
  },
  agent: {
    submit: "Masuk ke Dashboard Agen",
    passwordPlaceholder: "Masukkan kata sandi akun agen",
  },
  admin: {
    submit: "Masuk ke Dashboard Admin",
    passwordPlaceholder: "Masukkan kata sandi akun admin",
  },
};

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5 7 7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <>
          <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-3 3.6M6.3 6.9C4.2 8.2 3 10.2 3 12c0 0 4 6 9 6 1.2 0 2.3-.3 3.3-.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

function SubmitButton({ label }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className="mt-1 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#c5a869] px-4 text-[12px] font-bold text-[#0d3b2e] shadow-md transition-all hover:bg-[#d4af37] hover:shadow-lg active:opacity-95 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b2e]/30 border-t-[#0d3b2e]"
          />
          Memeriksa…
        </>
      ) : (
        <>
          {label}
          <span aria-hidden="true">→</span>
        </>
      )}
    </button>
  );
}

export default function PortalLoginForm({
  action,
  portal = "buyer",
  next,
  defaultEmail = "",
  showWhatsAppOtp = false,
}) {
  const [state, formAction] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const fieldErrors = state?.fieldErrors ?? {};
  const copy = COPY[portal] ?? COPY.buyer;

  const emailError = fieldErrors.email;
  const passwordError = fieldErrors.password;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state?.formError ? <Alert tone="danger">{state.formError}</Alert> : null}

      {state?.switchPortal ? (
        <p className="text-[12px] text-[#64748b]">
          <Link
            href={state.switchPortal.href}
            className="font-semibold text-[#0d3b2e] underline decoration-[#c5a869] underline-offset-2"
          >
            {state.switchPortal.label}
          </Link>
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-email"
          className="text-[11.5px] font-semibold text-[#0d3b2e]"
        >
          Email
        </label>
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3.5 text-[#94a3b8]">
            <MailIcon />
          </span>
          <input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            required
            defaultValue={defaultEmail}
            placeholder="nama@email.com"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "login-email-error" : undefined}
            className={`h-11 w-full rounded-lg border bg-[#f8f9fc] pl-10 pr-3.5 text-[13px] text-[#1a1a1a] placeholder:text-[#94a3b8] transition-colors focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#c5a869]/20 ${
              emailError
                ? "border-[#ba1a1a] focus:border-[#ba1a1a]"
                : "border-transparent focus:border-[#c5a869]"
            }`}
          />
        </div>
        {emailError ? (
          <p id="login-email-error" className="text-[10.5px] font-medium text-[#ba1a1a]">
            {emailError}
          </p>
        ) : (
          <p className="text-[10.5px] text-[#94a3b8]">
            {showWhatsAppOtp
              ? "Gunakan email yang terdaftar. Login lewat nomor WhatsApp belum tersedia."
              : "Gunakan email dan kata sandi akun Anda."}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="login-password"
            className="text-[11.5px] font-semibold text-[#0d3b2e]"
          >
            Kata Sandi
          </label>
          <a
            href={WA_RESET}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-[#b39556] no-underline transition-colors hover:text-[#0d3b2e]"
          >
            Lupa Kata Sandi?
          </a>
        </div>
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3.5 text-[#94a3b8]">
            <LockIcon />
          </span>
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder={copy.passwordPlaceholder}
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? "login-password-error" : undefined}
            className={`h-11 w-full rounded-lg border bg-[#f8f9fc] pl-10 pr-11 text-[13px] text-[#1a1a1a] placeholder:text-[#94a3b8] transition-colors focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#c5a869]/20 ${
              passwordError
                ? "border-[#ba1a1a] focus:border-[#ba1a1a]"
                : "border-transparent focus:border-[#c5a869]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-pressed={showPassword}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-2 flex h-8 w-9 items-center justify-center rounded-md text-[#64748b] transition-colors hover:bg-[#eef0f6] hover:text-[#0d3b2e]"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {passwordError ? (
          <p id="login-password-error" className="text-[10.5px] font-medium text-[#ba1a1a]">
            {passwordError}
          </p>
        ) : null}
      </div>

      <label className="flex cursor-pointer select-none items-center gap-2.5 pt-0.5">
        <input
          type="checkbox"
          name="remember"
          className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] accent-[#0d3b2e]"
        />
        <span className="text-[11.5px] text-[#64748b]">
          Ingat saya di perangkat ini
        </span>
      </label>

      <SubmitButton label={copy.submit} />

      {showWhatsAppOtp ? (
        <>
          <div className="relative my-1 flex items-center justify-center">
            <div className="h-px w-full bg-[#eef0f4]" />
            <span className="absolute bg-white px-3 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">
              atau masuk cepat
            </span>
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Login OTP WhatsApp belum tersedia"
            className="inline-flex h-[46px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#eef1f8] text-[12px] font-semibold text-[#64748b] opacity-80"
          >
            <span aria-hidden="true" className="text-[#2e9e5b]">
              ▣
            </span>
            Kirim Kode OTP via WhatsApp
            <span className="rounded bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#94a3b8]">
              Segera
            </span>
          </button>
        </>
      ) : null}
    </form>
  );
}
