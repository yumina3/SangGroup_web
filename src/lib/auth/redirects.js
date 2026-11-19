export const DASHBOARD_BY_ROLE = {
  buyer: "/dashboard/pembeli",
  agent: "/dashboard/penjual",
  admin: "/dashboard/admin",
};

export const LOGIN_BY_ROLE = {
  buyer: "/login",
  agent: "/login-agen",
  admin: "/login-admin",
};

export const ROLE_LABEL = {
  buyer: "pembeli",
  agent: "penjual/agen",
  admin: "admin",
};

/**
 * Hanya izinkan tujuan internal agar parameter `next` tidak bisa dipakai untuk
 * open redirect.
 */
export function safeNextPath(nextPath) {
  if (typeof nextPath !== "string") return null;
  if (!nextPath.startsWith("/")) return null;
  if (nextPath.startsWith("//")) return null;
  if (nextPath.includes("\\")) return null;
  if (/[\r\n\t]/.test(nextPath)) return null;
  return nextPath;
}

/** Path tanpa query/hash untuk perbandingan rute. */
function pathnameOf(path) {
  return path.split(/[?#]/)[0];
}

/** Apakah `path` berada di dalam `base` (termasuk base itu sendiri). */
function isWithin(path, base) {
  const pathname = pathnameOf(path);
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** Halaman yang tidak boleh menjadi tujuan setelah login. */
function isAuthPage(path) {
  const pathname = pathnameOf(path);
  return (
    pathname === "/login" ||
    pathname.startsWith("/login-") ||
    pathname === "/register" ||
    pathname === "/pasang-properti" ||
    pathname === "/penjual" ||
    pathname.startsWith("/akun/nonaktif")
  );
}

/**
 * Tentukan tujuan setelah login berhasil.
 *
 * Pembeli boleh kembali ke halaman publik mana pun (mis. detail properti atau
 * section kunjungan). Agen dan admin hanya boleh kembali ke area dashboard
 * miliknya agar tidak memicu lompatan antar-portal.
 */
export function resolvePostLoginPath({ role, status, nextPath }) {
  if (status === "pending") return "/akun/nonaktif?reason=pending";
  if (status === "inactive") return "/akun/nonaktif?reason=inactive";

  const home = DASHBOARD_BY_ROLE[role];
  if (!home) return "/akun/nonaktif?reason=pending";

  const safe = safeNextPath(nextPath);
  if (!safe || isAuthPage(safe)) return home;

  if (role === "buyer") {
    if (
      isWithin(safe, "/dashboard/penjual") ||
      isWithin(safe, "/dashboard/admin")
    ) {
      return home;
    }
    return safe;
  }

  return isWithin(safe, home) ? safe : home;
}

export function loginPathForRole(role, { next, reason = "unauth" } = {}) {
  const base = LOGIN_BY_ROLE[role] ?? "/login";
  const params = new URLSearchParams();
  if (reason) params.set("reason", reason);
  if (next) params.set("next", next);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/** Dipakai halaman publik lama yang mengarah ke login pembeli. */
export function loginPathFor(currentPath) {
  const params = new URLSearchParams({ reason: "unauth" });
  if (currentPath && currentPath !== "/login") params.set("next", currentPath);
  return `/login?${params.toString()}`;
}
