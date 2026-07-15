"use client";
import { Check, Minus, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/shadcn-ui/collapsible";
import { copyParams } from "@/shared/utils/store/search";

export type SearchOption = {
  id: string;
  name: string;
  values: { value: string }[];
};

type FilterOptionsProps = {
  options: SearchOption[];
  selectedValues: Set<string>;
  params: Record<string, string | string[] | undefined>;
};

export const FilterOptions = ({ options, selectedValues, params }: FilterOptionsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const MAX_VISIBLE = 6;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [showAllGroups, setShowAllGroups] = useState<Record<string, boolean>>({});

  const isOpen = (name: string) => openGroups[name] ?? true;

  const renderOptionValues = (option: SearchOption) => {
    const hasMore = option.values.length > MAX_VISIBLE;
    const hasSelectedHidden =
      hasMore && option.values.slice(MAX_VISIBLE).some((v) => selectedValues.has(v.value));
    const expanded = showAllGroups[option.name] ?? hasSelectedHidden;
    const displayed = hasMore && !expanded ? option.values.slice(0, MAX_VISIBLE) : option.values;

    return (
      <>
        {displayed.map((val) => {
          const isSelected = selectedValues.has(val.value);

          return (
            <button
              key={val.value}
              onClick={() => navigateWithOptions(val.value)}
              className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-all duration-200 ${
                isSelected
                  ? "text-foreground bg-black/4"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/3"
              }`}
            >
              <span className={isSelected ? "font-medium" : ""}>{val.value}</span>

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

        {hasMore && (
          <button
            onClick={() => setShowAllGroups((prev) => ({ ...prev, [option.name]: !expanded }))}
            className="flex w-full cursor-pointer px-2 text-left text-xs hover:text-black/80"
          >
            {expanded ? "Ver menos" : `Ver mais (${option.values.length - MAX_VISIBLE})`}

            {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        )}
      </>
    );
  };

  const navigateWithOptions = useCallback(
    (value: string) => {
      const next = new Set(selectedValues);

      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      const sp = new URLSearchParams();
      copyParams(sp, { ...params, optionValues: undefined });

      if (next.size > 0) {
        sp.set("optionValues", Array.from(next).join(","));
      }

      const qs = sp.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [selectedValues, params, pathname, router]
  );

  return (
    <div className="space-y-5">
      <span className="text-sm font-medium">Opções</span>
      {options.map((option) => (
        <Collapsible
          key={option.id}
          open={isOpen(option.name)}
          onOpenChange={(open) => setOpenGroups((prev) => ({ ...prev, [option.name]: open }))}
        >
          <CollapsibleTrigger asChild>
            <button className="mt-2 flex w-full cursor-pointer items-center justify-between rounded-md py-1 pr-2 text-sm font-medium transition-all duration-200 hover:bg-black/3">
              {option.name}
              {isOpen(option.name) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="flex flex-col gap-1 pt-1">{renderOptionValues(option)}</div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};
