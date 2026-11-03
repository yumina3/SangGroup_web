import { Suspense } from "react";

import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import Alert from "@/components/ui/Alert";

export const metadata = { title: "Masuk" };

const NOTICES = {
  unauth: "Silakan masuk untuk mengakses dashboard.",
};

/**
 * Bagian yang membaca searchParams dipisah ke komponen async + Suspense agar
 * sisa halaman tetap bisa dirender sebagai shell statis (Cache Components).
 */
async function LoginSection({ searchParams }) {
  const params = await searchParams;
  const reason = typeof params?.reason === "string" ? params.reason : null;
  const next = typeof params?.next === "string" ? params.next : null;
  const notice = reason ? NOTICES[reason] : null;

  return (
    <>
      {notice ? (
        <div className="mb-5">
          <Alert tone="info">{notice}</Alert>
        </div>
      ) : null}
      <LoginForm next={next} />
    </>
  );
}

export default function LoginPage({ searchParams }) {
  return (
    <AuthShell
      eyebrow="Akun pembeli"
      title="Masuk ke akun Anda"
      description="Pantau pengajuan, simpan properti favorit, dan lanjutkan komunikasi dengan agen."
      footer={
        <p>
          Ingin memasarkan properti?{" "}
          <a
            href="/pasang-properti"
            className="font-semibold text-brand underline underline-offset-2"
          >
            Pasang properti sebagai agen
          </a>
        </p>
      }
    >
      <Suspense fallback={<div className="h-[320px]" aria-hidden="true" />}>
        <LoginSection searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
