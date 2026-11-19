import Link from "next/link";
import { redirect } from "next/navigation";

import Alert from "@/components/ui/Alert";
import PortalAuthShell from "@/components/auth/PortalAuthShell";
import PortalLoginForm from "@/components/auth/PortalLoginForm";
import SessionSwitchNotice from "@/components/auth/SessionSwitchNotice";
import { agentLogoutAction } from "@/app/(auth)/logout/actions";
import { getSessionProfile } from "@/lib/auth/session";
import { resolvePostLoginPath } from "@/lib/auth/redirects";
import { agentLoginAction } from "./actions";

export const metadata = {
  title: "Masuk Portal Penjual",
  description:
    "Masuk ke dashboard agen SANG Group untuk mengelola listing, pengajuan pembeli, dan jadwal kunjungan.",
};

/** Halaman ini membaca cookie sesi, jadi selalu dirender saat request. */
export const instant = false;

const VALUE_PROPS = [
  "Mengelola listing properti, foto, dan status ketersediaan unit",
  "Menindaklanjuti pengajuan kunjungan serta minat beli calon pembeli",
  "Memantau performa listing dan rekap transaksi dari satu dashboard",
];

function readParam(params, key) {
  return typeof params?.[key] === "string" ? params[key] : null;
}

export default async function AgentLoginPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const next = readParam(params, "next");
  const reason = readParam(params, "reason");
  const registered = readParam(params, "registered");
  const pending = readParam(params, "pending");
  const confirm = readParam(params, "confirm");

  const profile = await getSessionProfile();

  if (profile?.status === "pending") {
    redirect("/akun/nonaktif?reason=pending");
  }
  if (profile?.status === "inactive") {
    redirect("/akun/nonaktif?reason=inactive");
  }

  if (profile?.role === "agent") {
    redirect(
      resolvePostLoginPath({
        role: "agent",
        status: profile.status,
        nextPath: next,
      }),
    );
  }

  const notice = profile ? (
    <SessionSwitchNotice
      profile={profile}
      portal="agen"
      logout={agentLogoutAction}
    />
  ) : registered ? (
    <Alert
      tone={confirm ? "info" : "success"}
      title={pending ? "Pendaftaran agen diterima" : "Akun agen berhasil dibuat"}
    >
      {confirm
        ? "Kami sudah mengirim tautan konfirmasi ke email Anda. Buka tautan tersebut, lalu tunggu persetujuan admin sebelum masuk."
        : "Akun Anda berstatus menunggu persetujuan admin. Kami akan memberi tahu lewat email terdaftar setelah akun aktif."}
    </Alert>
  ) : reason === "unauth" ? (
    <Alert tone="info">
      Silakan masuk ke portal penjual untuk melanjutkan. Anda akan dikembalikan
      ke halaman sebelumnya setelah berhasil.
    </Alert>
  ) : null;

  return (
    <PortalAuthShell
      portal="agent"
      title="Masuk ke Portal Penjual"
      description="Kelola listing properti, tindak lanjuti pengajuan pembeli, dan atur profil agen dari satu tempat."
      notice={notice}
      valueProps={VALUE_PROPS}
      valuePropsTitle="Dengan masuk ke Portal Penjual SANG Group, Anda dapat:"
      footer={
        <>
          Belum punya akun agen?{" "}
          <Link
            href="/pasang-properti"
            className="font-semibold text-[#b39556] underline decoration-[#c5a869] underline-offset-4 transition-colors hover:text-[#0d3b2e]"
          >
            Daftar sebagai agen
          </Link>{" "}
          — akun baru aktif setelah disetujui admin.
        </>
      }
    >
      {profile ? (
        <p className="text-center text-[12px] text-[#64748b]">
          Keluar dahulu dari akun saat ini untuk masuk ke portal penjual.
        </p>
      ) : (
        <PortalLoginForm
          action={agentLoginAction}
          portal="agent"
          next={next ?? undefined}
        />
      )}
    </PortalAuthShell>
  );
}
