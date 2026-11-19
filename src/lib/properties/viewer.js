/**
 * Ringkasan sesi yang dibutuhkan tombol favorit.
 *
 * Sengaja hanya membawa boolean dan status, bukan profil lengkap, agar data
 * akun tidak ikut masuk ke props komponen klien.
 */
export function favoriteViewer(profile) {
  return {
    isAuthenticated: Boolean(profile),
    isBuyer: profile?.role === "buyer",
    isActive: profile?.status === "active",
    status: profile?.status ?? null,
  };
}
