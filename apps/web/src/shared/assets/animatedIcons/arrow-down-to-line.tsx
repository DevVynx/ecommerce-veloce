"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/shared/utils/lib/utils";

export interface ArrowDownToLineIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ArrowDownToLineIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ARROW_VARIANTS: Variants = {
  normal: {
    translateY: 0,
  },
  animate: {
    translateY: [0, 2, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const ArrowDownToLineIcon = forwardRef<ArrowDownToLineIconHandle, ArrowDownToLineIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) controls.start("animate");
        onMouseEnter?.(e);
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) controls.start("normal");
        onMouseLeave?.(e);
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 21H5" />
          <motion.g animate={controls} variants={ARROW_VARIANTS}>
            <path d="M12 17V3" />
            <path d="m6 11 6 6 6-6" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

ArrowDownToLineIcon.displayName = "ArrowDownToLineIcon";

export { ArrowDownToLineIcon };
