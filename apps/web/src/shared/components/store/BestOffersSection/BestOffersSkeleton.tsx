"use client";

import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { ProductCardSkeleton } from "@/shared/components/store/ProductCardSkeleton";

export const BestOffersSkeleton = () => {
  return (
    <section className="bg-neutral-100 px-3 py-12">
      <div className="relative mx-auto lg:container">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <header className="flex flex-wrap items-center gap-3">
            <div className="ml-2 space-y-1">
              <Skeleton className="h-3 w-28 bg-neutral-300" />
              <Skeleton className="h-7 w-44 bg-neutral-300" />
            </div>
          </header>
        </div>
        <div className="flex gap-9 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
