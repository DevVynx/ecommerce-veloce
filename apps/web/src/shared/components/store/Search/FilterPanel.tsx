import type { SearchFiltersDto } from "@repo/types/contracts";

import { Separator } from "@/shared/components/shadcn-ui/separator";

import { FilterCategory } from "./FilterCategory";
import { FilterOnSale } from "./FilterOnSale";
import { FilterOptions } from "./FilterOptions";
import { FilterRating } from "./FilterRating";

type FilterPanelProps = {
  filters: SearchFiltersDto;
  selectedOptionValues: Set<string>;
  params: Record<string, string | string[] | undefined>;
};

export const FilterPanel = ({ filters, selectedOptionValues, params }: FilterPanelProps) => {
  return (
    <div className="flex flex-col gap-5">
      <FilterCategory categories={filters.categories} params={params} />

      <Separator />

      <FilterOnSale params={params} />

      <Separator />

      <FilterRating ratingOptions={filters.ratingOptions} params={params} />

      {filters.options.length > 0 && (
        <>
          <Separator />
          <FilterOptions
            options={filters.options}
            selectedValues={selectedOptionValues}
            params={params}
          />
        </>
      )}
    </div>
  );
};
