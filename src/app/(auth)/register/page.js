import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = { title: "Daftar Pembeli" };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Akun pembeli"
      title="Buat akun pembeli"
      description="Gratis dan langsung aktif. Simpan properti favorit serta ajukan kunjungan tanpa mengisi data berulang."
    >
      <RegisterForm />
    </AuthShell>
  );
}
