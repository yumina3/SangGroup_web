import { redirect } from "next/navigation";

import Alert from "@/components/ui/Alert";
import PortalAuthShell from "@/components/auth/PortalAuthShell";
import PortalLoginForm from "@/components/auth/PortalLoginForm";
import SessionSwitchNotice from "@/components/auth/SessionSwitchNotice";
import { adminLogoutAction } from "@/app/(auth)/logout/actions";
import { getSessionProfile } from "@/lib/auth/session";
import { resolvePostLoginPath } from "@/lib/auth/redirects";
import { adminLoginAction } from "./actions";

export const metadata = {
  title: "Masuk Portal Admin",
  description:
    "Portal khusus staf admin SANG Group untuk memverifikasi listing dan mengelola akun pengguna.",
};

/** Halaman ini membaca cookie sesi, jadi selalu dirender saat request. */
export const instant = false;

function readParam(params, key) {
  return typeof params?.[key] === "string" ? params[key] : null;
}

export default async function AdminLoginPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const next = readParam(params, "next");
  const reason = readParam(params, "reason");

  const profile = await getSessionProfile();

  if (profile?.status === "pending") {
    redirect("/akun/nonaktif?reason=pending");
  }
  if (profile?.status === "inactive") {
    redirect("/akun/nonaktif?reason=inactive");
  }

  if (profile?.role === "admin") {
    redirect(
      resolvePostLoginPath({
        role: "admin",
        status: profile.status,
        nextPath: next,
      }),
    );
  }

  const notice = profile ? (
    <SessionSwitchNotice
      profile={profile}
      portal="admin"
      logout={adminLogoutAction}
    />
  ) : reason === "unauth" ? (
    <Alert tone="info">
      Silakan masuk dengan akun admin untuk melanjutkan.
    </Alert>
  ) : null;

  return (
    <PortalAuthShell
      portal="admin"
      title="Masuk ke Portal Admin"
      description="Portal ini hanya untuk staf admin SANG Group. Akses diberikan oleh pemilik sistem."
      notice={notice}
      footer="Akses terbatas. Setiap aktivitas masuk dan perubahan data dicatat untuk keamanan."
    >
      {profile ? (
        <p className="text-center text-[12px] text-[#64748b]">
          Keluar dahulu dari akun saat ini untuk masuk ke portal admin.
        </p>
      ) : (
        <PortalLoginForm
          action={adminLoginAction}
          portal="admin"
          next={next ?? undefined}
        />
      )}
    </PortalAuthShell>
  );
}
