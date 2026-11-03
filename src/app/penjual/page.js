import { redirect } from "next/navigation";

import AuthShell from "@/components/auth/AuthShell";
import PenjualLoginForm from "@/components/auth/PenjualLoginForm";
import { DEMO_PENJUAL, readPenjualSession } from "@/lib/auth/penjual-session";

export const metadata = { title: "Masuk Penjual" };

/** Halaman ini membaca cookie sesi, jadi tidak diprerender (tidak ada shell statis berguna). */
export const instant = false;

/**
 * Gerbang dashboard penjual.
 *
 * Membuka /penjual selalu memperlihatkan formulir login lebih dulu. Bila sesi
 * penjual masih berlaku, pengguna langsung diteruskan ke /dashboard/penjual
 * (tidak perlu mengetik ulang). Setelah login, Server Action menulis cookie
 * sesi lalu mengarahkan ke dashboard.
 *
 * Halaman ini membaca cookie, jadi dirender di request time. Tidak ada
 * pembungkus <Suspense> karena tidak ada shell statis yang berguna untuk
 * gerbang login ini.
 */
export default async function PenjualGatePage() {
  const session = await readPenjualSession();
  if (session) redirect("/dashboard/penjual");

  return (
    <AuthShell
      eyebrow="Portal penjual"
      title="Masuk ke dashboard agen"
      description="Kelola listing, tindak lanjuti pengajuan pembeli, dan atur profil agen dari satu tempat."
      footer={
        <p>
          Belum punya akun agen?{" "}
          <a href="/pasang-properti" className="font-semibold text-brand underline underline-offset-2">
            Daftar sebagai agen
          </a>{" "}
          — akun baru aktif setelah disetujui admin.
        </p>
      }
    >
      <PenjualLoginForm />

      <div className="mt-5 rounded-md border border-dashed border-line bg-brand-cream px-4 py-3 text-[12px] leading-relaxed text-muted">
        <p className="font-semibold text-brand-ink">Akun demo</p>
        <p className="mt-1">
          Email: <code className="font-semibold text-brand-ink">{DEMO_PENJUAL.email}</code>
          <br />
          Kata sandi: <code className="font-semibold text-brand-ink">{DEMO_PENJUAL.password}</code>
        </p>
        <p className="mt-1">
          Mode demo: data dashboard masih contoh dan perubahan hanya tampil di layar ini.
        </p>
      </div>
    </AuthShell>
  );
}
