"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/shared/utils/lib/utils";

export interface ProgressProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  indicatorProps?: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, indicatorProps, ...props }, ref) => {
    const { className: indicatorClassName, ...restIndicatorProps } = indicatorProps || {};

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("bg-secondary relative h-4 w-full overflow-hidden rounded-full", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("bg-primary h-full w-full flex-1 transition-all", indicatorClassName)}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          {...restIndicatorProps}
        />
      </ProgressPrimitive.Root>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
