import type { SearchFiltersDto } from "@repo/types/contracts";

import { Separator } from "@/shared/components/shadcn-ui/separator";

import { FilterCategory } from "./FilterCategory";
import { FilterOnSale } from "./FilterOnSale";
import { FilterOptions } from "./FilterOptions";
import { FilterPriceRange } from "./FilterPriceRange";
import { FilterRating } from "./FilterRating";

type FilterPanelProps = {
  filters: SearchFiltersDto;
  selectedOptionValueIds: Set<string>;
  params: Record<string, string | string[] | undefined>;
};

export const FilterPanel = ({ filters, selectedOptionValueIds, params }: FilterPanelProps) => {
  return (
    <div className="flex flex-col gap-5">
      <FilterCategory categories={filters.categories} params={params} />

      <Separator />

      <FilterPriceRange
        absoluteMin={filters.priceRange.absoluteMin}
        absoluteMax={filters.priceRange.absoluteMax}
        params={params}
      />

      <Separator />

      <FilterOnSale onSaleCount={filters.onSaleCount} params={params} />

      <Separator />

      <FilterRating params={params} />

      {filters.options.length > 0 && (
        <>
          <Separator />
          <FilterOptions
            options={filters.options}
            selectedValues={selectedOptionValueIds}
            params={params}
          />
        </>
      )}
    </div>
  );
};
