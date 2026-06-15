"use client";
import { XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/shared/components/shadcn-ui/badge";
import { formatPrice } from "@/shared/utils/store/price";
import { buildKeepUrl, buildRemoveUrl, normalizeParam } from "@/shared/utils/store/search";

const REMOVE_MAP: Record<string, string[]> = {
  categoryId: ["categoryId"],
  price: ["minPrice", "maxPrice"],
  onSale: ["onSale"],
  minRating: ["minRating"],
  optionValueIds: ["optionValueIds"],
};

type ActiveFiltersProps = {
  params: Record<string, string | string[] | undefined>;
  priceRangeMax: number;
  categories: { id: string; name: string }[];
};

export const ActiveFilters = ({ params, priceRangeMax, categories }: ActiveFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const categoryId = normalizeParam(params.categoryId);
  const categoryName = categories.find((c) => c.id === categoryId)?.name;
  const minPrice = normalizeParam(params.minPrice);
  const maxPrice = normalizeParam(params.maxPrice);
  const onSale = normalizeParam(params.onSale);
  const minRating = normalizeParam(params.minRating);
  const optionValueIds = normalizeParam(params.optionValueIds);
  const items: { label: string; removeKey: string }[] = [];

  if (categoryId && categoryName) items.push({ label: categoryName, removeKey: "categoryId" });
  if (minPrice ?? maxPrice) {
    items.push({
      label: `${formatPrice(Number(minPrice ?? 0))} — ${formatPrice(Number(maxPrice ?? priceRangeMax))}`,
      removeKey: "price",
    });
  }
  if (onSale === "true") items.push({ label: "Em oferta", removeKey: "onSale" });
  if (minRating) items.push({ label: `${minRating}★ ou mais`, removeKey: "minRating" });
  if (optionValueIds) items.push({ label: "Opções", removeKey: "optionValueIds" });

  if (items.length === 0) return null;

  const handleRemove = (removeKey: string) => {
    const keys = REMOVE_MAP[removeKey] ?? [removeKey];
    router.push(buildRemoveUrl(pathname, params, ...keys));
  };

  const handleClearAll = () => {
    const url = buildKeepUrl(pathname, params, "q");
    router.push(url || "/");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <Badge
          key={item.removeKey}
          onClick={() => handleRemove(item.removeKey)}
          variant="secondary"
          className="cursor-pointer gap-1 px-3 py-1"
        >
          {item.label}
          <button className="ml-1" aria-label={`Remover filtro ${item.label}`}>
            <XIcon className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <button
        onClick={handleClearAll}
        className="ml-5 cursor-pointer text-xs text-gray-500 underline hover:text-black"
      >
        Limpar tudo
      </button>
    </div>
  );
};
