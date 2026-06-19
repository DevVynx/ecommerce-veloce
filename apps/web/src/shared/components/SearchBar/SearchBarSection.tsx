import { type ReactNode } from "react";

import { cn } from "@/shared/utils/lib/utils";

type SearchBarSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
};

export const SearchBarSection = ({
  title,
  children,
  className,
  titleClassName,
}: SearchBarSectionProps) => {
  if (!children) return null;

  return (
    <div className={cn("px-1 py-2", className)}>
      <p
        className={cn(
          "text-muted-foreground px-2 pb-1 text-xs font-semibold tracking-wider uppercase",
          titleClassName
        )}
      >
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
};
