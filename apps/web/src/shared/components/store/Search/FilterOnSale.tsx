"use client";
import { usePathname, useRouter } from "next/navigation";

import { copyParams, normalizeParam } from "@/shared/utils/store/search";

type FilterOnSaleProps = {
  onSaleCount: number;
  params: Record<string, string | string[] | undefined>;
};

export const FilterOnSale = ({ onSaleCount, params }: FilterOnSaleProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isOnSale = normalizeParam(params.onSale) === "true";

  const handleChange = (checked: boolean) => {
    const sp = new URLSearchParams();
    copyParams(sp, params);

    if (checked) {
      sp.set("onSale", "true");
    } else {
      sp.delete("onSale");
    }

    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Ofertas</span>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isOnSale}
          onChange={(e) => handleChange(e.target.checked)}
          className="size-4 accent-black"
        />
        Apenas em oferta ({onSaleCount})
      </label>
    </div>
  );
};
