import { X } from "lucide-react";

import { cn } from "@/shared/utils/lib/utils";

import { HighlightedText } from "./HighlightedText";

type SearchBarItemProps = {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
  onRemove?: () => void;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  highlightQuery?: string;
};

export const SearchBarItem = ({
  icon,
  text,
  isActive,
  onClick,
  onRemove,
  className,
  iconClassName,
  textClassName,
  highlightQuery,
}: SearchBarItemProps) => {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted",
        className
      )}
    >
      <span className={cn("text-muted-foreground", iconClassName)}>{icon}</span>
      <span className={cn("flex-1 truncate", textClassName)}>
        {highlightQuery ? <HighlightedText text={text} query={highlightQuery} /> : text}
      </span>
      {onRemove && (
        <span
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove();
          }}
          className="text-muted-foreground hover:text-foreground ml-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </span>
      )}
    </button>
  );
};
