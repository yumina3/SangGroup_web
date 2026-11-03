import AuthShell from "@/components/auth/AuthShell";
import AgentRegisterForm from "@/components/auth/AgentRegisterForm";
import Alert from "@/components/ui/Alert";

export const metadata = { title: "Pasang Properti" };

export default function PasangPropertiPage() {
  return (
    <AuthShell
      eyebrow="Akun agen"
      title="Pasang properti Anda"
      description="Daftarkan diri sebagai agen Sang Group untuk mengelola listing, foto, koordinat, dan tindak lanjut pengajuan."
    >
      <div className="mb-5">
        <Alert tone="warning" title="Perlu persetujuan admin">
          Akun agen berstatus menunggu. Anda baru bisa mengakses dashboard
          setelah admin menyetujui pendaftaran.
        </Alert>
      </div>
      <AgentRegisterForm />
    </AuthShell>
  );
}
