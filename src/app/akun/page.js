import Link from "next/link";

import { readAllNotificationsAction } from "@/app/akun/actions";
import BuyerFavorites from "@/components/akun/BuyerFavorites";
import BuyerInquiries from "@/components/akun/BuyerInquiries";
import { requirePageUser } from "@/lib/auth/current-user";
import { listFavorites } from "@/lib/services/favorites";
import { listBuyerInquiries } from "@/lib/services/inquiries";
import { listNotifications } from "@/lib/services/notifications";

export const metadata = { title: "Akun Saya" };
export const instant = false;

/**
 * Dashboard pembeli sesuai PRD §6: favorit, pengajuan, dan notifikasi.
 */
export default async function AkunPage() {
  const user = await requirePageUser(["buyer"]);
  const [favorites, inquiries, notifications] = await Promise.all([
    listFavorites(user.id),
    listBuyerInquiries(user.id, { page: 1, pageSize: 20 }),
    listNotifications(user.id, { page: 1, pageSize: 10 }),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-[20px] font-bold">Halo, {user.fullName}</h1>
        <p className="mt-1 text-[13px] text-ag-slate-secondary">
          {favorites.length} favorit · {inquiries.total} pengajuan · {notifications.unread} notifikasi
          belum dibaca
        </p>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[17px] font-bold">Favorit saya</h2>
            <p className="text-[12.5px] text-ag-slate-secondary">
              Properti yang Anda simpan untuk dilihat kembali.
            </p>
          </div>
          <Link href="/properti" className="text-[12.5px] font-semibold text-ag-forest hover:underline">
            Jelajahi katalog →
          </Link>
        </div>
        <BuyerFavorites items={favorites} />
      </section>

      <section>
        <h2 className="text-[17px] font-bold">Pengajuan saya</h2>
        <p className="mb-3 mt-1 text-[12.5px] text-ag-slate-secondary">
          Status terbaru dari agen. Pengajuan aktif bisa dibatalkan kapan saja.
        </p>
        <BuyerInquiries items={inquiries.items} />
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[17px] font-bold">Notifikasi</h2>
          {notifications.unread > 0 ? (
            <form action={readAllNotificationsAction}>
              <button
                type="submit"
                className="rounded-lg border border-ag-line px-3 py-1.5 text-[12px] font-semibold hover:bg-ag-surface-low"
              >
                Tandai semua dibaca
              </button>
            </form>
          ) : null}
        </div>

        {notifications.items.length === 0 ? (
          <p className="rounded-dash border border-dashed border-ag-line bg-white px-4 py-6 text-center text-[13px] text-ag-slate-secondary">
            Belum ada notifikasi.
          </p>
        ) : (
          <ul className="divide-y divide-ag-line rounded-dash border border-ag-line bg-white">
            {notifications.items.map((item) => (
              <li key={item.id} className="px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[13.5px] font-semibold">{item.title}</p>
                    <p className="text-[12.5px] text-ag-slate-secondary">{item.body}</p>
                    <p className="mt-0.5 text-[11px] text-ag-slate-muted">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      }).format(new Date(item.createdAt))}
                    </p>
                  </div>
                  {!item.readAt ? (
                    <span className="rounded-full bg-ag-gold/15 px-2 py-0.5 text-[10.5px] font-bold text-ag-forest">
                      Baru
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
