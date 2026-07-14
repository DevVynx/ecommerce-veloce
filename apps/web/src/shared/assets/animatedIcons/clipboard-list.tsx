"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/shared/utils/lib/utils";

export interface ClipboardListIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ClipboardListIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CONTENT_VARIANTS: Variants = {
  normal: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

const LINE_VARIANTS: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const DOT_VARIANTS: Variants = {
  normal: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  animate: {
    scale: [0, 1.3, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const ClipboardListIcon = forwardRef<ClipboardListIconHandle, ClipboardListIconProps>(
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
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
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
          <rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />

          <motion.g animate={controls} initial="normal" variants={CONTENT_VARIANTS}>
            <motion.path d="M8 11h.01" variants={DOT_VARIANTS} />
            <motion.path d="M12 11h4" variants={LINE_VARIANTS} />
            <motion.path d="M8 16h.01" variants={DOT_VARIANTS} />
            <motion.path d="M12 16h4" variants={LINE_VARIANTS} />
          </motion.g>
        </svg>
      </div>
    );
  }
);

ClipboardListIcon.displayName = "ClipboardListIcon";

export { ClipboardListIcon };
