import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";

export const CartShippingSkeleton = () => {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="size-5 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-24 shrink-0 rounded-md" />
      </div>
    </div>
  );
};
