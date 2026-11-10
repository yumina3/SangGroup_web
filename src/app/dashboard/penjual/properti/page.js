import { Suspense } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import PageHeader from "@/components/dashboard/PageHeader";
import Pagination from "@/components/dashboard/Pagination";
import { PanelSkeleton } from "@/components/dashboard/Skeletons";
import PropertyTable from "@/components/dashboard/property/PropertyTable";
import PropertyToolbar from "@/components/dashboard/property/PropertyToolbar";
import {
  filterProperties,
  paginate,
  parsePropertyQuery,
} from "@/lib/dashboard/agent-filters";
import { requirePageUser } from "@/lib/auth/current-user";
import { getAgentDashboard } from "@/lib/services/properties";
import { formatNumber } from "@/lib/dashboard/format";

export const metadata = { title: "Properti Saya" };

/**
 * Daftar properti milik agen (SRS-F-SEL-02).
 *
 * `searchParams` membuat halaman ini dialirkan di dalam <Suspense> pada
 * request; shell dashboard tetap cepat. Filter dan pagination dibaca dari URL.
 */
export default function AgentPropertiesPage({ searchParams }) {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Properti"]}
        title="Properti Saya"
        description="Kelola listing milik Anda: perbarui data, atur ketersediaan, dan kirim ulang listing yang ditolak."
        actions={
          <ActionButton as="link" href="/dashboard/penjual/properti/baru" variant="primary">
            + Tambah Listing
          </ActionButton>
        }
      />

      <Suspense fallback={<PanelSkeleton rows={6} />}>
        <PropertyListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PropertyListSection({ searchParams }) {
  const params = (await searchParams) ?? {};
  const query = parsePropertyQuery(params);
  const user = await requirePageUser(["agent"]);
  const { properties } = await getAgentDashboard(user.id);

  const filtered = filterProperties(properties, query);
  const result = paginate(filtered, query.page);

  return (
    <>
      <PropertyToolbar query={query} />

      <section className="overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ag-line px-4 py-3">
          <p className="text-[13px] text-ag-slate-secondary">
            <span className="font-semibold text-ag-slate">{formatNumber(result.total)}</span>{" "}
            properti {query.q || query.sale || query.listing ? "sesuai filter" : "terdaftar"}
          </p>
          <p className="text-[12px] text-ag-slate-muted">
            Menampilkan {result.items.length} baris per halaman
          </p>
        </div>

        <PropertyTable items={result.items} />

        {result.total > 0 ? (
          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            total={result.total}
            pageSize={result.pageSize}
            basePath="/dashboard/penjual/properti"
            params={{ q: query.q, sale: query.sale, listing: query.listing }}
            itemLabel="properti"
          />
        ) : null}
      </section>
    </>
  );
}
