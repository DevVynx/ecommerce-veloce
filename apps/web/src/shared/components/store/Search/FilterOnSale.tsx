"use client";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { copyParams, normalizeParam } from "@/shared/utils/store/search";

type FilterOnSaleProps = {
  params: Record<string, string | string[] | undefined>;
};

export const FilterOnSale = ({ params }: FilterOnSaleProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isOnSale = normalizeParam(params.onSale) === "true";

  const handleClick = () => {
    const sp = new URLSearchParams();
    copyParams(sp, params);

    if (isOnSale) {
      sp.delete("onSale");
    } else {
      sp.set("onSale", "true");
    }

    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Ofertas</span>
      <button
        onClick={handleClick}
        className={`group flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-all duration-200 ${
          isOnSale
            ? "text-foreground bg-black/4"
            : "text-muted-foreground hover:text-foreground hover:bg-black/3"
        }`}
      >
        <span className={isOnSale ? "font-medium" : ""}>Apenas em oferta</span>
        <span className="text-muted-foreground flex items-center gap-2 text-xs">
          <Check
            className={`h-4 w-4 transition-all duration-200 ${
              isOnSale ? "block scale-100 opacity-100" : "hidden scale-75"
            }`}
          />
        </span>
      </button>
    </div>
  );
};
