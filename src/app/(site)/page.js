import HeroSite from "@/components/site/HeroSite";
import { ExploreBand, NatureSection } from "@/components/site/HomeSections";
import GisSection from "@/components/site/GisSection";
import NewsSection from "@/components/site/NewsSection";
import PortfolioSection from "@/components/site/PortfolioSection";
import TourSection from "@/components/site/TourSection";
import VisitSection from "@/components/site/VisitSection";
import { getSessionProfile } from "@/lib/auth/session";
import {
  listFavoriteIds,
  listPublicProperties,
} from "@/lib/properties/catalog";
import { favoriteViewer } from "@/lib/properties/viewer";

export const metadata = {
  title: "Sang Group — Residential & Lifestyle Community",
  description:
    "Kawasan hunian terpadu dan arsitektur tropis terbaik di Semarang: Sang Dipa Candisari, Sang Wira Tembalang, dan Sang Naya Sambiroto.",
};

/** Beranda membaca sesi dan katalog properti pada setiap request. */
export const instant = false;

/**
 * Beranda situs publik.
 *
 * Section disusun bertahap mengikuti docs/site/
 * beranda_sang_group_persis_gambar_referensi/code.html:
 * Hero → Explore → Nature/Facilities → Tour 360° → Portfolio → GIS → News →
 * VIP Contact. Navbar & footer datang dari layout (site).
 *
 * Kartu portofolio memakai listing dari database supaya tombol favorit punya
 * id properti yang sah; tampilan kartunya tidak berubah.
 */
export default async function BerandaPage() {
  const [propertiesResult, profile] = await Promise.all([
    listPublicProperties(),
    getSessionProfile(),
  ]);

  const viewer = favoriteViewer(profile);
  const favoriteIds =
    viewer.isBuyer && viewer.isActive
      ? await listFavoriteIds(profile.id)
      : new Set();

  return (
    <>
      <HeroSite />
      <ExploreBand />
      <NatureSection />
      <TourSection />
      <PortfolioSection
        properties={propertiesResult.ok ? propertiesResult.properties : []}
        viewer={viewer}
        favoriteIds={[...favoriteIds]}
      />
      <GisSection />
      <NewsSection />
      <VisitSection />
    </>
  );
}
