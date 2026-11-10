import Link from "next/link";

import AuthShell from "@/components/auth/AuthShell";

export const metadata = { title: "Daftar Sebagai Agen" };

/**
 * SRS FR-20/FR-22: pendaftaran publik hanya untuk pembeli. Akun agen dibuat
 * oleh admin (role ditetapkan proses berwenang), jadi halaman ini menjelaskan
 * alurnya alih-alih membuka pendaftaran mandiri.
 */
export default function AgentRegistrationInfoPage() {
  return (
    <AuthShell
      eyebrow="Portal agen"
      title="Akun agen dibuat oleh admin"
      description="Untuk menjaga kewenangan role, pendaftaran agen tidak dibuka untuk publik."
      footer={
        <p>
          Ingin membeli rumah?{" "}
          <Link href="/register" className="font-semibold text-brand underline underline-offset-2">
            Daftar sebagai pembeli
          </Link>
          .
        </p>
      }
    >
      <div className="space-y-4 text-[13px] leading-relaxed text-muted">
        <p>
          Sesuai SRS <strong>FR-20</strong> dan <strong>FR-22</strong>, registrasi publik hanya
          untuk pembeli. Akun penjual/agen dan admin ditetapkan oleh admin melalui panel pengguna.
        </p>
        <p>
          Jika Anda staf SANG Group, hubungi admin untuk dibuatkan akun. Setelah akun aktif, masuk
          lewat halaman portal agen.
        </p>
        <Link
          href="/penjual"
          className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-[13px] font-semibold text-white"
        >
          Ke halaman masuk
        </Link>
      </div>
    </AuthShell>
  );
}
