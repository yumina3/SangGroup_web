import { redirect } from "next/navigation";

import AuthShell from "@/components/auth/AuthShell";
import PenjualLoginForm from "@/components/auth/PenjualLoginForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata = { title: "Masuk Penjual" };

/** Halaman ini membaca cookie sesi, jadi tidak diprerender. */
export const instant = false;

const HOME_BY_ROLE = {
  agent: "/dashboard/penjual",
  admin: "/admin",
  buyer: "/akun",
};

/**
 * Gerbang login. Bila sesi masih berlaku, pengguna langsung diarahkan ke
 * area sesuai perannya.
 *
 * Akun demo berasal dari `prisma/seed.mts` (jalankan `npm run db:seed`),
 * dibuat lewat Supabase Auth, bukan konstanta di kode.
 */
export default async function PenjualGatePage() {
  const user = await getCurrentUser();
  if (user) redirect(HOME_BY_ROLE[user.role] ?? "/");

  return (
    <AuthShell
      eyebrow="Portal penjual"
      title="Masuk ke dashboard agen"
      description="Kelola listing, tindak lanjuti pengajuan pembeli, dan atur profil agen dari satu tempat."
      footer={
        <p>
          Ingin membeli rumah?{" "}
          <a href="/register" className="font-semibold text-brand underline underline-offset-2">
            Daftar sebagai pembeli
          </a>
          . Akun agen/admin dibuat oleh admin (SRS FR-22).
        </p>
      }
    >
      <PenjualLoginForm />

      <div className="mt-5 rounded-md border border-dashed border-line bg-brand-cream px-4 py-3 text-[12px] leading-relaxed text-muted">
        <p className="font-semibold text-brand-ink">Akun demo hasil seed</p>
        <p className="mt-1">
          Agen: <code className="font-semibold text-brand-ink">nadia.prameswari@sanggroup.id</code>
          <br />
          Kata sandi: <code className="font-semibold text-brand-ink">penjual12345</code>
        </p>
        <p className="mt-1">
          Admin: <code className="font-semibold text-brand-ink">admin@sanggroup.id</code> ·{" "}
          <code className="font-semibold text-brand-ink">admin12345</code>
        </p>
        <p className="mt-1">
          Jalankan <code>npm run db:seed</code> setelah migrasi untuk membuat akun ini.
        </p>
      </div>
    </AuthShell>
  );
}
