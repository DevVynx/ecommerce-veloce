import { Suspense } from "react";

import { HeroBanner } from "@/shared/components/store/Banner";
import { BestOffersSection } from "@/shared/components/store/BestOffersSection/BestOffersSection";
import { BestOffersSkeleton } from "@/shared/components/store/BestOffersSection/BestOffersSkeleton";
import { CategoriesSection } from "@/shared/components/store/CategoriesSection/CategoriesSection";
import { HOME_CATEGORIES } from "@/shared/components/store/CategoriesSection/categoryConsts";
import { ForYouSection } from "@/shared/components/store/ForYouSection/ForYouSection";
import { ForYouSectionSkeleton } from "@/shared/components/store/ForYouSection/ForYouSectionSkeleton";
import { Header } from "@/shared/components/store/Header/Header";

const Home = async () => {
  return (
    <div className="relative z-10 overflow-x-hidden">
      <Header />
      <HeroBanner />
      <main className="max-w-9xl mx-auto flex flex-col bg-white pb-14 lg:pb-0">
        <CategoriesSection categories={HOME_CATEGORIES} />

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
