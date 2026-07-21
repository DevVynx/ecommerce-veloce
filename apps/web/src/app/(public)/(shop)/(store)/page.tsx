import { Suspense } from "react";

import { HeroBanner } from "@/shared/components/Store/Banner";
import { BestOffersSection } from "@/shared/components/Store/BestOffersSection/BestOffersSection";
import { BestOffersSkeleton } from "@/shared/components/Store/BestOffersSection/BestOffersSkeleton";
import { CategoriesSection } from "@/shared/components/Store/CategoriesSection/CategoriesSection";
import { ForYouSection } from "@/shared/components/Store/ForYouSection/ForYouSection";
import { ForYouSectionSkeleton } from "@/shared/components/Store/ForYouSection/ForYouSectionSkeleton";
import { Header } from "@/shared/components/Store/Header/Header";

const Home = async () => {
  return (
    <div className="relative z-10 overflow-x-hidden">
      <Header />
      <HeroBanner />
      <main className="bg-white">
        <Suspense fallback={null}>
          <CategoriesSection />
        </Suspense>

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
