"use client";
import { Check, StarIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { copyParams, normalizeParam } from "@/shared/utils/store/search";

type RatingOption = {
  value: number;
};

type FilterRatingProps = {
  ratingOptions: RatingOption[];
  params: Record<string, string | string[] | undefined>;
};

export const FilterRating = ({ ratingOptions, params }: FilterRatingProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const selected = Number(normalizeParam(params.minRating)) || undefined;

  const navigateWithRating = (rating: number | undefined) => {
    const sp = new URLSearchParams();
    copyParams(sp, params);

    if (rating) {
      sp.set("minRating", String(rating));
    } else {
      sp.delete("minRating");
    }

    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="space-y-0">
      <span className="text-sm font-medium">Avaliação Mínima</span>
      <div className="flex flex-col gap-1">
        {ratingOptions.map(({ value }) => {
          const isSelected = selected === value;
          const hasResults = true;

          return (
            <button
              key={value}
              disabled={!hasResults}
              onClick={() => navigateWithRating(isSelected ? undefined : value)}
              className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-all duration-200 ${
                isSelected
                  ? "bg-yellow-50 font-medium text-yellow-700"
                  : hasResults
                    ? "text-muted-foreground hover:text-foreground hover:bg-black/3"
                    : "text-muted-foreground cursor-not-allowed opacity-40"
              }`}
            >
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 transition-colors ${
                      i < value
                        ? isSelected
                          ? "fill-yellow-500 stroke-yellow-500"
                          : "fill-yellow-400 stroke-yellow-400"
                        : isSelected
                          ? "stroke-yellow-200"
                          : "stroke-gray-300"
                    }`}
                  />
                ))}

                <span
                  className={`ml-1 text-xs transition-colors ${
                    isSelected ? "text-yellow-700" : "text-gray-400"
                  }`}
                >
                  {value === 5 ? "5★" : `${value}★ ou mais`}
                </span>
              </span>

              <span className="text-muted-foreground flex items-center gap-2 text-xs">
                <Check
                  className={`h-4 w-4 transition-all duration-200 ${
                    isSelected ? "block scale-100 opacity-100" : "hidden scale-75"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
