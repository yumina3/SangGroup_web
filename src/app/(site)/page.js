import HeroSite from "@/components/site/HeroSite";
import { ExploreBand, NatureSection } from "@/components/site/HomeSections";
import GisSection from "@/components/site/GisSection";
import NewsSection from "@/components/site/NewsSection";
import PortfolioSection from "@/components/site/PortfolioSection";
import TourSection from "@/components/site/TourSection";
import VisitSection from "@/components/site/VisitSection";

export const metadata = {
  title: "Sang Group — Residential & Lifestyle Community",
  description:
    "Kawasan hunian terpadu dan arsitektur tropis terbaik di Semarang: Sang Dipa Candisari, Sang Wira Tembalang, dan Sang Naya Sambiroto.",
};

/**
 * Beranda situs publik.
 *
 * Section disusun bertahap mengikuti docs/site/
 * beranda_sang_group_persis_gambar_referensi/code.html:
 * Hero → Explore → Nature/Facilities → Tour 360° → Portfolio → GIS → News →
 * VIP Contact. Navbar & footer datang dari layout (site).
 */
export default function BerandaPage() {
  return (
    <>
      <HeroSite />
      <ExploreBand />
      <NatureSection />
      <TourSection />
      <PortfolioSection />
      <GisSection />
      <NewsSection />
      <VisitSection />
    </>
  );
}
