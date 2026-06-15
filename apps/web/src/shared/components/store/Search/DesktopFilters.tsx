"use client";
import type { SearchFiltersDto } from "@repo/types/contracts";

import { useScrollDirection } from "@/shared/hooks/ui/useScrollDirection";

import { FilterPanel } from "./FilterPanel";

type DesktopFiltersProps = {
  filters: SearchFiltersDto;
  selectedOptionValueIds: Set<string>;
  params: Record<string, string | string[] | undefined>;
};

const HEADER_HEIGHT = 64;

export const DesktopFilters = ({
  filters,
  selectedOptionValueIds,
  params,
}: DesktopFiltersProps) => {
  const scrollDir = useScrollDirection();
  const isHeaderHidden = scrollDir === "down";
  const topOffset = isHeaderHidden ? 4 : HEADER_HEIGHT + 4;

  return (
    <aside className="hidden w-70 shrink-0 lg:block">
      <div
        className="sticky max-h-[calc(100vh-2rem)] overflow-y-auto px-2 transition-[top] duration-300 ease-in-out"
        style={{ top: `${topOffset}px` }}
      >
        <FilterPanel
          filters={filters}
          selectedOptionValueIds={selectedOptionValueIds}
          params={params}
        />
      </div>
    </aside>
  );
};
