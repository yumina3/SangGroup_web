import Link from "next/link";
import { redirect } from "next/navigation";

import Alert from "@/components/ui/Alert";
import PortalAuthShell from "@/components/auth/PortalAuthShell";
import PortalLoginForm from "@/components/auth/PortalLoginForm";
import SessionSwitchNotice from "@/components/auth/SessionSwitchNotice";
import { buyerLogoutAction } from "@/app/(auth)/logout/actions";
import { getSessionProfile } from "@/lib/auth/session";
import { resolvePostLoginPath } from "@/lib/auth/redirects";
import { buyerLoginAction } from "./actions";

export const metadata = {
  title: "Masuk Akun Pembeli",
  description:
    "Masuk ke akun pembeli SANG Group untuk menyimpan properti favorit, mengajukan kunjungan, dan memantau status minat beli.",
};

export const instant = false;

const VALUE_PROPS = [
  "Menyimpan dan membandingkan unit kavling & rumah favorit",
  "Mengajukan dan mengubah jadwal survei show unit tanpa bentrok",
  "Memantau transparan progres SP3K KPR, berkas legalitas SHM, & notaris",
];

function readParam(params, key) {
  return typeof params?.[key] === "string" ? params[key] : null;
}

export default async function LoginPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const next = readParam(params, "next");
  const registered = readParam(params, "registered");
  const confirm = readParam(params, "confirm");
  const reason = readParam(params, "reason");

  const profile = await getSessionProfile();

  if (profile?.status === "pending") {
    redirect("/akun/nonaktif?reason=pending");
  }
  if (profile?.status === "inactive") {
    redirect("/akun/nonaktif?reason=inactive");
  }

  if (profile?.role === "buyer") {
    redirect(
      resolvePostLoginPath({
        role: "buyer",
        status: profile.status,
        nextPath: next,
      }),
    );
  }

  const notice = profile ? (
    <SessionSwitchNotice
      profile={profile}
      portal="pembeli"
      logout={buyerLogoutAction}
    />
  ) : registered ? (
    <Alert tone={confirm ? "info" : "success"} title={confirm ? "Cek email Anda" : "Akun berhasil dibuat"}>
      {confirm
        ? "Kami sudah mengirim tautan konfirmasi. Buka tautan tersebut sebelum masuk ke akun pembeli."
        : "Silakan masuk memakai email dan kata sandi yang baru Anda daftarkan."}
    </Alert>
  ) : reason === "unauth" ? (
    <Alert tone="info">
      Silakan masuk untuk melanjutkan. Anda akan dikembalikan ke halaman
      sebelumnya setelah berhasil.
    </Alert>
  ) : null;

  return (
    <PortalAuthShell
      portal="buyer"
      title="Masuk ke Akun Pembeli"
      description="Masuk untuk menyimpan properti favorit, menjadwalkan survei lokasi, dan memantau progres minat beli Anda."
      notice={notice}
      valueProps={VALUE_PROPS}
      footer={
        <>
          Belum punya akun pembeli?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#b39556] underline decoration-[#c5a869] underline-offset-4 transition-colors hover:text-[#0d3b2e]"
          >
            Daftar Akun Baru
          </Link>
        </>
      }
    >
      {profile ? (
        <p className="text-center text-[12px] text-[#64748b]">
          Keluar dahulu dari akun saat ini untuk masuk sebagai pembeli.
        </p>
      ) : (
        <PortalLoginForm
          action={buyerLoginAction}
          portal="buyer"
          next={next ?? undefined}
          showWhatsAppOtp
        />
      )}
    </PortalAuthShell>
  );
}
