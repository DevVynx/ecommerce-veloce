import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { ProductCardSkeleton } from "@/shared/components/Store/ProductCardSkeleton";

export const SearchPageSkeleton = () => {
  return (
    <main className="container mx-auto mt-10 px-2 py-8 md:px-0">
      <Skeleton className="mb-4 h-9 w-80" />

      <div className="mb-2 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>

      <Skeleton className="mb-4 h-px w-full" />

      <div className="mb-4 flex items-center justify-between gap-4 lg:hidden">
        <Skeleton className="h-10 w-24 border" />
        <Skeleton className="h-10 w-40 border" />
      </div>

      <div className="gap-6 lg:flex">
        <aside className="hidden w-70 shrink-0 lg:block">
          <div className="space-y-5">
            <Skeleton className="h-6 w-32" />

            <div>
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-44 w-full" />
            </div>

            <div>
              <Skeleton className="mb-2 h-4 w-16" />
              <Skeleton className="h-12 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />

            <div>
              <Skeleton className="mb-2 h-4 w-14" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>

            <Skeleton className="h-24 w-full" />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-4 hidden items-center justify-end gap-4 lg:flex">
            <Skeleton className="h-10 w-40" />
          </div>

          <Skeleton className="mb-4 h-4 w-48" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} grid />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
