export const DASHBOARD_BY_ROLE = {
  buyer: "/pembeli",
  agent: "/agen",
  admin: "/admin",
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
  return nextPath;
}

/**
 * Menentukan tujuan setelah login berhasil (SRS §3.3).
 */
export function resolvePostLoginPath({ role, status, nextPath }) {
  if (status === "pending") return "/akun/nonaktif?reason=pending";
  if (status === "inactive") return "/akun/nonaktif?reason=inactive";

  const dashboard = DASHBOARD_BY_ROLE[role];
  if (!dashboard) return "/akun/nonaktif?reason=pending";

  const safe = safeNextPath(nextPath);
  if (safe && safe !== "/login" && safe !== "/register") return safe;

  return dashboard;
}

export function loginPathFor(currentPath) {
  const params = new URLSearchParams({ reason: "unauth" });
  if (currentPath && currentPath !== "/login") params.set("next", currentPath);
  return `/login?${params.toString()}`;
}
