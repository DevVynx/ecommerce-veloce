"use client";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { copyParams, normalizeParam } from "@/shared/utils/store/search";

type FilterCategoryProps = {
  categories: { id: string; name: string }[];
  params: Record<string, string | string[] | undefined>;
};

export const FilterCategory = ({ categories, params }: FilterCategoryProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = normalizeParam(params.categoryId);

  const navigateWithCategory = (newId: string | undefined) => {
    const sp = new URLSearchParams();
    copyParams(sp, params);

    if (newId) {
      sp.set("categoryId", newId);
    } else {
      sp.delete("categoryId");
    }

    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Categoria</span>

      <div className="flex flex-col gap-1">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedId;

          return (
            <button
              key={cat.id}
              onClick={() => navigateWithCategory(isSelected ? undefined : cat.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-all duration-200 ${
                isSelected
                  ? "text-foreground bg-black/4"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/3"
              } `}
            >
              <span className={isSelected ? "font-medium" : ""}>{cat.name}</span>

              <span className="text-muted-foreground flex items-center gap-2 text-xs">
                <Check
                  className={`h-4 w-4 transition-all duration-200 ${isSelected ? "block scale-100 opacity-100" : "hidden scale-75"} `}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
