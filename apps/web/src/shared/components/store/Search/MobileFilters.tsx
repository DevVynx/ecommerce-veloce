"use client";
import type { SearchFiltersDto } from "@repo/types/contracts";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shared/components/shadcn-ui/sheet";

import { FilterPanel } from "./FilterPanel";

type MobileFiltersProps = {
  filters: SearchFiltersDto;
  selectedOptionValueIds: Set<string>;
  params: Record<string, string | string[] | undefined>;
};

export const MobileFilters = ({ filters, selectedOptionValueIds, params }: MobileFiltersProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <button className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium">
          Filtros
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetTitle className="sr-only">Filtros</SheetTitle>
        <FilterPanel
          filters={filters}
          selectedOptionValueIds={selectedOptionValueIds}
          params={params}
        />
      </SheetContent>
    </Sheet>
  );
};
