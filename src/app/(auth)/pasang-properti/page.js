import Link from "next/link";

import AgentRegisterForm from "@/components/auth/AgentRegisterForm";
import PortalAuthShell from "@/components/auth/PortalAuthShell";
import Alert from "@/components/ui/Alert";

export const metadata = { title: "Pasang Properti" };

export default function PasangPropertiPage() {
  return (
    <PortalAuthShell
      portal="agent"
      title="Daftar Akun Agen"
      description="Daftarkan diri sebagai agen Sang Group untuk mengelola listing, foto, koordinat, dan tindak lanjut pengajuan."
      notice={
        <Alert tone="warning" title="Perlu persetujuan admin">
          Akun agen berstatus menunggu. Anda baru bisa mengakses dashboard
          setelah admin menyetujui pendaftaran.
        </Alert>
      }
      footer={
        <>
          Sudah punya akun agen?{" "}
          <Link
            href="/login-agen"
            className="font-semibold text-[#b39556] underline decoration-[#c5a869] underline-offset-4 transition-colors hover:text-[#0d3b2e]"
          >
            Masuk portal penjual
          </Link>
        </>
      }
    >
      <AgentRegisterForm />
    </PortalAuthShell>
  );
}
