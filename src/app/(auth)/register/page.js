import Link from "next/link";

import PortalAuthShell from "@/components/auth/PortalAuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Daftar Akun Pembeli",
  description:
    "Buat akun pembeli SANG Group untuk menyimpan properti favorit, mengajukan kunjungan, dan memantau status minat beli.",
};

export default function RegisterPage() {
  return (
    <PortalAuthShell
      portal="buyer"
      title="Buat Akun Pembeli"
      description="Gratis dan langsung aktif. Simpan properti favorit serta ajukan kunjungan tanpa mengisi data berulang."
      footer={
        <>
          Sudah punya akun pembeli?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#b39556] underline decoration-[#c5a869] underline-offset-4 transition-colors hover:text-[#0d3b2e]"
          >
            Masuk di sini
          </Link>
        </>
      }
    >
      <RegisterForm />
    </PortalAuthShell>
  );
}
