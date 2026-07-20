import { Suspense } from "react";

import { getCategories } from "@/shared/actions/products/getCategories";
import { HeroBanner } from "@/shared/components/Store/Banner";
import { BestOffersSection } from "@/shared/components/Store/BestOffersSection/BestOffersSection";
import { BestOffersSkeleton } from "@/shared/components/Store/BestOffersSection/BestOffersSkeleton";
import { CategoriesSection } from "@/shared/components/Store/CategoriesSection/CategoriesSection";
import { CATEGORY_LOGO_MAP } from "@/shared/components/Store/CategoriesSection/categoryLogos";
import { ForYouSection } from "@/shared/components/Store/ForYouSection/ForYouSection";
import { ForYouSectionSkeleton } from "@/shared/components/Store/ForYouSection/ForYouSectionSkeleton";
import { Header } from "@/shared/components/Store/Header/Header";

const Home = async () => {
  const { data } = await getCategories();
  const categories =
    data?.categories
      .filter((cat) => CATEGORY_LOGO_MAP[cat.name])
      .map((cat) => ({
        label: cat.name,
        logo: CATEGORY_LOGO_MAP[cat.name]!,
        href: `/search?categoryId=${cat.id}`,
      })) ?? [];

  return (
    <div className="relative z-10 overflow-x-hidden">
      <Header />
      <HeroBanner />
      <main className="bg-white">
        <CategoriesSection categories={categories} />

        <Suspense fallback={<BestOffersSkeleton />}>
          <BestOffersSection />
        </Suspense>

        <Suspense fallback={<ForYouSectionSkeleton />}>
          <ForYouSection />
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
