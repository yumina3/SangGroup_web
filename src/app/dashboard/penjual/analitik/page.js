import SalesAnalyticsWorkspace from "@/components/dashboard/analytics/SalesAnalyticsWorkspace";
import { getSalesAnalyticsDatasets } from "@/lib/dashboard/analytics-data";

export const metadata = { title: "Analitik Penjualan" };

/**
 * Analitik penjualan penjual/agen.
 *
 * Layout dashboard sudah memasang navbar bersama; halaman ini hanya
 * menyiapkan data demo per periode lalu menyerahkannya ke workspace klien.
 */
export default function SalesAnalyticsPage() {
  return <SalesAnalyticsWorkspace datasets={getSalesAnalyticsDatasets()} />;
}
