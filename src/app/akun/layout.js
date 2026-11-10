import Link from "next/link";

import { logoutAction } from "@/app/penjual/actions";
import PushNotifications from "@/components/notifications/PushNotifications";
import { requirePageUser } from "@/lib/auth/current-user";

export const metadata = { title: "Akun Saya — SANG Group" };
export const instant = false;

export default async function AkunLayout({ children }) {
  const user = await requirePageUser(["buyer"]);

  return (
    <div className="min-h-dvh bg-ag-ivory text-ag-slate">
      <header className="border-b border-ag-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ag-slate-muted">
              Akun pembeli
            </p>
            <p className="text-[15px] font-bold">{user.fullName}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-[13px] font-semibold">
            <PushNotifications compact />
            <Link href="/" className="text-ag-slate-secondary hover:underline">
              Beranda
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-ag-line px-3 py-1.5 text-[12px] font-semibold hover:bg-ag-surface-low"
              >
                Keluar
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
