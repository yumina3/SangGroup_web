import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/**
 * Plus Jakarta Sans dipakai untuk seluruh aplikasi, situs publik maupun
 * dashboard. Bobot 200–800 mencakup judul, label, dan teks isi (kerning/lead
 * tetap bawaan variabel font Google).
 */
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Playfair Display khusus wordmark dan judul hero situs publik. Varian normal
 * dan italic dimuat terpisah agar tidak mengubah typeface judul atau teks lain
 * di seluruh aplikasi.
 */
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Sang Group",
    template: "%s — Sang Group",
  },
  description:
    "Sang Group Semarang — eco-luxury residence di Candisari, Tembalang, dan Sambiroto.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
