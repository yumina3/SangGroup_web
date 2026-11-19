import Link from "next/link";

import Alert from "@/components/ui/Alert";
import { DASHBOARD_BY_ROLE, ROLE_LABEL } from "@/lib/auth/redirects";

/**
 * Ditampilkan ketika pengunjung sudah punya sesi dari portal lain. Menyediakan
 * tombol keluar agar tidak terjebak tanpa cara berpindah akun.
 */
export default function SessionSwitchNotice({ profile, portal, logout }) {
  const roleLabel = ROLE_LABEL[profile.role] ?? profile.role;

  return (
    <Alert tone="info" title="Anda sudah masuk dengan akun lain">
      Akun <strong>{profile.email}</strong> terdaftar sebagai {roleLabel}.{" "}
      <Link
        href={DASHBOARD_BY_ROLE[profile.role] ?? "/"}
        className="font-semibold underline"
      >
        Buka dashboard {roleLabel}
      </Link>
      .
      <form action={logout} className="mt-3">
        <button
          type="submit"
          className="inline-flex h-8 items-center rounded-md border border-[#0d3b2e]/20 px-3 text-[11px] font-semibold text-[#0d3b2e] transition-colors hover:border-[#0d3b2e] hover:bg-[#0d3b2e] hover:text-white"
        >
          Keluar dari akun ini
        </button>
      </form>
      <p className="mt-2 text-[11px] text-[#64748b]">
        Setelah keluar, Anda dapat masuk sebagai {portal}.
      </p>
    </Alert>
  );
}
