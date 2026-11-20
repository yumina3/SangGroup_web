import "server-only";

import { getCurrentUser } from "@/lib/auth/current-user";
import { isDatabaseConfigured } from "@/lib/db/client";
import {
  getAgentDashboard as getAgentDashboardFromDb,
  getAgentProfileView,
} from "@/lib/services/properties";

/**
 * Kontrak data dashboard agen.
 *
 * Seluruh halaman dashboard menerima bentuk data di bawah ini. Sejak modul
 * backend digabung, isinya berasal dari service Prisma (data persisten milik
 * agen yang sedang login), bukan lagi objek contoh. Adapter di service sudah
 * menerjemahkan status SRS (`pending/approved`, `tersedia/dipesan/terjual`,
 * `menunggu/dihubungi/...`) ke label lama yang dipakai komponen UI.
 *
 * @typedef {"DRAFT"|"PENDING"|"VERIFIED"|"REJECTED"|"HIDDEN"} ListingStatus
 * @typedef {"AVAILABLE"|"BOOKED"|"SOLD"} SaleStatus
 * @typedef {"PENDING"|"CONFIRMED"|"RESCHEDULED"|"REJECTED"|"COMPLETED"|"CANCELLED"} InquiryStatus
 * @typedef {"VISIT"|"INTEREST"} InquiryType
 */

export { AGENT_CATEGORY_OPTIONS } from "./ui-constants";

/** Profil pengganti bila sesi/database belum tersedia (UI tetap bisa dirender). */
const EMPTY_AGENT = {
  id: "",
  name: "Agen Sang Group",
  email: "",
  phone: "",
  agencyName: "SANG Group",
  agentCode: "-",
  avatarUrl: null,
};

const EMPTY_DASHBOARD = {
  agent: EMPTY_AGENT,
  summary: {
    totalProperties: 0,
    pendingVerification: 0,
    activeInquiries: 0,
    soldProperties: 0,
    soldValue: 0,
    availableCount: 0,
    bookedCount: 0,
    activeListingValue: 0,
  },
  properties: [],
  inquiries: [],
};

async function currentAgent() {
  if (!isDatabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user || user.role !== "agent") return null;
  return user;
}

/** Profil agen yang sedang login. */
export async function getAgentProfile() {
  const user = await currentAgent();
  if (!user) return { ...EMPTY_AGENT };
  try {
    return await getAgentProfileView(user.id);
  } catch {
    return { ...EMPTY_AGENT };
  }
}

/** Dashboard agen: profil, ringkasan, listing, dan pengajuan dari database. */
export async function getAgentDashboard() {
  const user = await currentAgent();
  if (!user) return EMPTY_DASHBOARD;

  try {
    const data = await getAgentDashboardFromDb(user.id);
    return {
      ...data,
      agent: { ...EMPTY_AGENT, ...data.agent },
    };
  } catch {
    return EMPTY_DASHBOARD;
  }
}
