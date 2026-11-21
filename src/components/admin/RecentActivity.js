import Panel from "@/components/dashboard/Panel";
import {
  IconBan,
  IconBuilding,
  IconCalendar,
  IconHourglass,
  IconList,
  IconUsers,
} from "@/components/dashboard/icons";

const ACTIVITY_STYLE = {
  visit: {
    Icon: IconCalendar,
    className: "bg-emerald-50 text-emerald-700",
  },
  listing: {
    Icon: IconBuilding,
    className: "bg-blue-50 text-blue-700",
  },
  reject: {
    Icon: IconBan,
    className: "bg-red-50 text-red-600",
  },
  user: {
    Icon: IconUsers,
    className: "bg-violet-50 text-violet-700",
  },
  category: {
    Icon: IconList,
    className: "bg-amber-50 text-amber-700",
  },
};

/**
 * Umpan aktivitas lintas pengguna. Isinya berasal dari pengajuan terbaru yang
 * dibaca halaman induk dari database.
 */
export default function RecentActivity({ items }) {
  return (
    <Panel
      title="Aktivitas Terbaru"
      action={<IconHourglass size={18} className="text-ag-slate-muted" />}
      className="h-full"
    >
      {items.length === 0 ? (
        <p className="rounded-dash border border-dashed border-ag-line px-4 py-6 text-center text-[12.5px] text-ag-slate-secondary">
          Belum ada aktivitas terbaru.
        </p>
      ) : (
        <ul className="space-y-3.5">
          {items.map((item) => {
            const style = ACTIVITY_STYLE[item.type] ?? ACTIVITY_STYLE.listing;
            const Icon = style.Icon;

            return (
              <li key={item.id} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.className}`}
                >
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] leading-snug text-ag-slate">
                    <span className="font-semibold">{item.actor}</span>{" "}
                    {item.action}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ag-slate-muted">
                    {item.timeLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
