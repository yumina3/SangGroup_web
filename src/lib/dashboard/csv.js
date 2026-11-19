/**
 * Pembantu ekspor CSV yang berjalan sepenuhnya di browser.
 *
 * Semua halaman dashboard yang punya tombol ekspor memakai fungsi ini supaya
 * format sel, BOM UTF-8, dan pembersihan object URL konsisten. Tidak ada data
 * yang dikirim ke server; berkas dibuat dari baris yang sedang tampil.
 */

/** Bungkus satu sel dengan tanda kutip dan escape kutip ganda. */
export function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * Unduh baris CSV sebagai berkas.
 *
 * @param {string} filename nama berkas tanpa ekstensi
 * @param {Array<Array<string|number>>} rows baris pertama adalah header
 * @returns {boolean} true bila unduhan dibuat
 */
export function downloadCsv(filename, rows) {
  if (typeof document === "undefined" || rows.length === 0) return false;

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);

  return true;
}
