import { cn } from "@/shared/utils/lib/utils";

type StockBadgeProps = {
  isAvailable: boolean;
  className?: string;
};

export const StockBadge = ({ isAvailable, className }: StockBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        isAvailable
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-600",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", isAvailable ? "bg-green-500" : "bg-red-500")} />
      {isAvailable ? "Em Estoque" : "Fora de Estoque"}
    </span>
  );
};
