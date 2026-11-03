import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/**
 * Satu typeface untuk seluruh aplikasi, situs publik maupun dashboard:
 * Plus Jakarta Sans. Bobot 200–800 mencakup judul, label, dan teks isi,
 * sehingga tidak ada lagi font serif terpisah (kerning/lead tetap bawaan
 * variabel font Google).
 */
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
