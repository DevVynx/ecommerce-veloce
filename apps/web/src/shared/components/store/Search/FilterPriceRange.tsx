"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Slider } from "@/shared/components/shadcn-ui/slider";
import { formatPrice } from "@/shared/utils/store/price";
import { copyParams, normalizeParam } from "@/shared/utils/store/search";

type FilterPriceRangeProps = {
  absoluteMin: number;
  absoluteMax: number;
  params: Record<string, string | string[] | undefined>;
};

export const FilterPriceRange = ({ absoluteMin, absoluteMax, params }: FilterPriceRangeProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const selectedMin = Number(normalizeParam(params.minPrice)) || undefined;
  const selectedMax = Number(normalizeParam(params.maxPrice)) || undefined;

  const valueMin = selectedMin ?? absoluteMin;
  const valueMax = selectedMax ?? absoluteMax;

  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);

  useEffect(() => {
    setLocalMin(valueMin);
    setLocalMax(valueMax);
  }, [valueMin, valueMax]);

  const handleCommit = (values: number[]) => {
    const newMin = values[0] ?? absoluteMin;
    const newMax = values[1] ?? absoluteMax;

    setLocalMin(newMin);
    setLocalMax(newMax);

    const sp = new URLSearchParams();
    copyParams(sp, params);

    if (newMin > absoluteMin) {
      sp.set("minPrice", String(newMin));
    } else {
      sp.delete("minPrice");
    }

    if (newMax < absoluteMax) {
      sp.set("maxPrice", String(newMax));
    } else {
      sp.delete("maxPrice");
    }

    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Faixa de Preço</span>

      <Slider
        value={[localMin, localMax]}
        min={absoluteMin}
        max={absoluteMax}
        step={1}
        onValueChange={(vals) => {
          if (vals[0] !== undefined) setLocalMin(vals[0]);
          if (vals[1] !== undefined) setLocalMax(vals[1]);
        }}
        onValueCommit={handleCommit}
        className="py-2"
      />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatPrice(localMin)}</span>
        <span>{formatPrice(localMax)}</span>
      </div>
    </div>
  );
};
