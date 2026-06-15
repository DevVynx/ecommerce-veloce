"use client";
import { StarIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { copyParams, normalizeParam } from "@/shared/utils/store/search";

const RATINGS = [4, 3, 2, 1];

type FilterRatingProps = {
  params: Record<string, string | string[] | undefined>;
};

export const FilterRating = ({ params }: FilterRatingProps) => {
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
      <div className="flex flex-col gap-2">
        {RATINGS.map((rating) => {
          const isSelected = selected === rating;

          return (
            <button
              key={rating}
              onClick={() => navigateWithRating(isSelected ? undefined : rating)}
              className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-all duration-200 ${
                isSelected
                  ? "bg-yellow-50 font-medium text-yellow-700"
                  : "text-muted-foreground hover:bg-black/5"
              } `}
            >
              <div
                className={`flex transition-transform duration-200 ${
                  isSelected ? "scale-105" : ""
                }`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 transition-colors ${
                      i < rating
                        ? isSelected
                          ? "fill-yellow-500 stroke-yellow-500"
                          : "fill-yellow-400 stroke-yellow-400"
                        : isSelected
                          ? "stroke-yellow-200"
                          : "stroke-gray-300"
                    }`}
                  />
                ))}
              </div>

              <span
                className={`ml-1 text-xs transition-colors ${
                  isSelected ? "text-yellow-700" : "text-gray-400"
                }`}
              >
                {rating === 5 ? "5★" : `${rating}★ ou mais`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
