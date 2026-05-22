import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";

export const CartSummarySkeleton = () => {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-24 rounded-xl border bg-white shadow-sm">
        <div className="p-6">
          <Skeleton className="mb-5 h-6 w-44 rounded" />

          <div className="bg-muted mb-5 space-y-1.5 rounded-lg p-3">
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-52 rounded" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>

          <Skeleton className="my-4 h-px w-full rounded" />

          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-7 w-24 rounded" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 w-20 shrink-0 rounded-md" />
          </div>

          <div className="mt-6 space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
