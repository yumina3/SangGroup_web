import { Suspense } from "react";
import Link from "next/link";

import Alert from "@/components/ui/Alert";

export const metadata = { title: "Akun Tidak Dapat Digunakan" };

const REASON = {
  pending: {
    title: "Menunggu persetujuan admin",
    body: "Pendaftaran agen Anda sudah kami terima. Akun dapat digunakan setelah admin menyetujui. Kami akan memberi tahu lewat email terdaftar.",
  },
  inactive: {
    title: "Akun nonaktif",
    body: "Akun ini dinonaktifkan. Hubungi admin Sang Group untuk mengaktifkannya kembali.",
  },
};

async function ReasonSection({ searchParams }) {
  const params = await searchParams;
  const key = typeof params?.reason === "string" ? params.reason : "inactive";
  const reason = REASON[key] ?? REASON.inactive;

  return (
    <Alert tone="warning" title={reason.title}>
      {reason.body}
    </Alert>
  );
}

export default function AkunNonaktifPage({ searchParams }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-cream px-5 py-12">
      <div className="w-full max-w-[440px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
          Status akun
        </p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight text-brand-ink">
          Akun belum dapat diakses
        </h1>

        <div className="mt-5">
          <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
            <ReasonSection searchParams={searchParams} />
          </Suspense>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-[13px]">
          <Link
            href="/login"
            className="font-semibold text-brand underline underline-offset-2"
          >
            Kembali ke halaman masuk
          </Link>
          <a
            href="/"
            className="font-semibold text-muted underline underline-offset-2"
          >
            Ke beranda
          </a>
        </div>
      </div>
    </main>
  );
}
