"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import { copyParams } from "@/shared/utils/store/search";

export type SearchOption = {
  id: string;
  name: string;
  values: { id: string; value: string }[];
};

type FilterOptionsProps = {
  options: SearchOption[];
  selectedValues: Set<string>;
  params: Record<string, string | string[] | undefined>;
};

export const FilterOptions = ({ options, selectedValues, params }: FilterOptionsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateWithOptions = useCallback(
    (valueId: string) => {
      const next = new Set(selectedValues);
      if (next.has(valueId)) {
        next.delete(valueId);
      } else {
        next.add(valueId);
      }

      const sp = new URLSearchParams();
      copyParams(sp, { ...params, optionValueIds: undefined });

      if (next.size > 0) {
        sp.set("optionValueIds", Array.from(next).join(","));
      }

      const qs = sp.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [selectedValues, params, pathname, router]
  );

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Opções</span>
      {options.map((option) => (
        <div key={option.id} className="space-y-1">
          <span className="text-xs font-medium text-gray-500">{option.name}</span>
          <div className="flex flex-col gap-0.5">
            {option.values.map((val) => (
              <label
                key={val.id}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-black/5"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.has(val.id)}
                  onChange={() => navigateWithOptions(val.id)}
                  className="size-4 accent-black"
                />
                {val.value}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
