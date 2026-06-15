"use client";
import type { SearchProductsRequest } from "@repo/types/contracts";
import { usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { copyParams, normalizeParam } from "@/shared/utils/store/search";

type SortValue = NonNullable<SearchProductsRequest["sortBy"]>;

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "rating_desc", label: "Melhor Avaliação" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "newest", label: "Mais Recentes" },
];

type SortSelectProps = {
  params: Record<string, string | string[] | undefined>;
};

export const SortSelect = ({ params }: SortSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = normalizeParam(params.sortBy) as SortValue | undefined;

  const handleChange = (value: SortValue) => {
    const sp = new URLSearchParams();
    copyParams(sp, params);
    sp.set("sortBy", value);
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-gray-500 sm:inline">Ordenar por:</span>
      <Select
        value={currentSort ?? "rating_desc"}
        onValueChange={(v) => handleChange(v as SortValue)}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
