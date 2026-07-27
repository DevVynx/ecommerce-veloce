import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";

export const ProductDetailsSkeleton = () => {
  return (
    <div className="flex h-125 gap-10">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col-reverse gap-3 lg:flex-row">
          <div className="flex w-full overflow-y-auto">
            <div className="my-1 mr-2 ml-1 flex w-26 gap-3 lg:flex-col">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="w-full" />
          </div>
        </div>
      </div>

      <div className="flex h-full w-95 flex-col">
        <div className="shrink-0">
          <Skeleton className="mb-3 h-8 w-3/4 rounded" />

          <div className="mb-3 space-y-1.5">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
            <Skeleton className="h-3 w-3/5 rounded" />
          </div>

          <div className="my-3 flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="size-4 rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-4 w-28 rounded" />
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-zinc-300 pb-3">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-5 w-14 rounded-sm" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pt-2 pb-4">
          <div className="mb-6 space-y-5">
            {Array.from({ length: 2 }).map((_, optIdx) => (
              <div key={optIdx}>
                <div className="mb-2 flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 4 }).map((_, valIdx) => (
                    <Skeleton key={valIdx} className="h-9 w-20 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded" />
            <div className="flex items-center">
              <Skeleton className="h-9 w-8 rounded-none" />
              <Skeleton className="h-9 w-14 rounded-none" />
              <Skeleton className="h-9 w-8 rounded-none" />
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-zinc-200 pt-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-75 flex-1 shrink-0 rounded-lg" />
            <Skeleton className="h-15 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
