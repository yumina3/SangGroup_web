export const metadata = {
  title: { default: "Dashboard", template: "%s — SANG Group" },
};

/**
 * Layout netral untuk seluruh area dashboard. Pemeriksaan sesi dan kerangka
 * tampilan dipasang di masing-masing portal (`penjual`, `pembeli`, `admin`)
 * agar navbar agen tidak membungkus dashboard pembeli atau admin.
 */
export default function DashboardGroupLayout({ children }) {
  return children;
}
