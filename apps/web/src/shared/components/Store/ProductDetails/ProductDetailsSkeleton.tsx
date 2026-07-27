import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";

export const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto mt-10 px-2 py-8 md:px-0">
      <section className="mb-10 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="w-full lg:sticky lg:top-24 lg:max-h-150 lg:max-w-155 lg:flex-2 lg:overflow-hidden xl:max-w-200">
          <div className="flex h-full flex-col-reverse gap-3 lg:flex-row">
            <div className="flex w-full overflow-y-auto lg:w-auto">
              <div className="my-1 mr-2 ml-1 flex w-26 gap-3 lg:flex-col">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="bg-muted relative flex aspect-square w-full rounded-lg">
              <Skeleton className="h-full w-full rounded-lg" />
              <Skeleton className="absolute right-2 bottom-2 h-5 w-14 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col lg:flex-1 lg:justify-between">
          <div>
            <Skeleton className="h-4 w-28 rounded" />

            <Skeleton className="mt-4 h-8 w-3/4 rounded" />

            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="size-4 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            <div className="mt-4 mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-32 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
              </div>
              <Skeleton className="mt-1 h-4 w-48 rounded" />
            </div>

            <div className="mb-6 space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <div className="mb-3 flex items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-10 w-20 rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="space-y-3">
              <div className="my-8 flex items-center gap-3">
                <Skeleton className="h-4 w-20 rounded" />
                <div className="flex items-center rounded-md border border-zinc-200">
                  <Skeleton className="h-10 w-10 rounded-none" />
                  <Skeleton className="h-10 w-10 rounded-none" />
                  <Skeleton className="h-10 w-10 rounded-none" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-15 flex-1 rounded-lg" />
                <Skeleton className="h-15 w-15 rounded-lg" />
              </div>
            </div>

            <div className="flex items-center justify-around gap-8 border-b border-zinc-200 py-6">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8">
        <div className="flex gap-8 border-b border-zinc-200">
          <Skeleton className="h-10 w-40 rounded-none" />
          <Skeleton className="h-10 w-32 rounded-none" />
        </div>
        <div className="pt-6">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="mt-2 h-4 w-full rounded" />
          <Skeleton className="mt-2 h-4 w-5/6 rounded" />
        </div>
      </div>

      <section className="pb-10 lg:py-10">
        <Skeleton className="mx-auto mb-4 h-6 w-64 rounded lg:mb-6" />
        <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
