import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";

export const CartItemSkeleton = () => {
  return (
    <div className="flex h-38 gap-3 rounded-xl border bg-white p-3 shadow-sm sm:h-auto sm:gap-4 sm:p-4">
      <div className="flex h-full w-28 items-center justify-center sm:h-35 sm:w-35">
        <Skeleton className="h-28 w-28 rounded-lg sm:h-35 sm:w-35" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 flex-1 rounded" />
            <Skeleton className="size-5 shrink-0 rounded" />
          </div>

          <div className="mt-1.5 space-y-1">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-5 w-20 rounded" />

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
