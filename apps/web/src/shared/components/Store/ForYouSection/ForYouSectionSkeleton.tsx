"use client";

import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { ProductCardSkeleton } from "@/shared/components/Store/ProductCardSkeleton";

export const ForYouSectionSkeleton = () => {
  return (
    <section id="forYouSection" className="px-2 py-12">
      <div className="mx-auto lg:container">
        <Skeleton className="mx-auto h-7 w-32" />

        <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} grid />
          ))}
        </div>
      </div>
    </section>
  );
};
