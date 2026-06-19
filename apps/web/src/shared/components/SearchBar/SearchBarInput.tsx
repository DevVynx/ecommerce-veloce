import { Search } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/shared/utils/lib/utils";

type SearchBarInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
  searchButtonClassName?: string;
};

export const SearchBarInput = forwardRef<HTMLInputElement, SearchBarInputProps>(
  (
    {
      value,
      onChange,
      onKeyDown,
      onFocus,
      onSearch,
      placeholder = "Faça a sua busca.",
      className,
      searchButtonClassName,
    },
    ref
  ) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder={placeholder}
          role="combobox"
          aria-expanded
          aria-autocomplete="list"
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-4 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            className
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault();
            onSearch?.();
          }}
          className={cn(
            "text-muted-foreground hover:text-foreground absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors",
            searchButtonClassName
          )}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    );
  }
);

SearchBarInput.displayName = "SearchBarInput";
