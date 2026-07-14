"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/shared/utils/lib/utils";

export interface TicketPercentIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface TicketPercentIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  bgClassName?: string;
}

const ROTATION_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  animate: {
    rotate: [0, -75, -75],
    transition: { duration: 0.9, ease: "easeInOut", times: [0, 0.45, 1] },
  },
};

const BACK_SPLIT_VARIANTS: Variants = {
  normal: {
    x: 0,
    y: 0,
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  animate: {
    x: [0, 0, -2.5],
    y: [0, 0, -2.5],
    opacity: [0, 1, 1],
    transition: { duration: 0.9, ease: "easeInOut", times: [0, 0.45, 1] },
  },
};

const FRONT_SPLIT_VARIANTS: Variants = {
  normal: {
    x: 0,
    y: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  animate: {
    x: [0, 0, 2.5],
    y: [0, 0, 2.5],
    transition: { duration: 0.9, ease: "easeInOut", times: [0, 0.45, 1] },
  },
};

const TicketPercentIcon = forwardRef<TicketPercentIconHandle, TicketPercentIconProps>(
  ({ onMouseEnter, onMouseLeave, className, bgClassName, size = 28, ...props }, ref) => {
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
          style={{ overflow: "visible" }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g
            animate={controls}
            initial="normal"
            style={{ transformOrigin: "12px 12px" }}
            variants={ROTATION_VARIANTS}
          >
            <motion.g variants={BACK_SPLIT_VARIANTS}>
              <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M9 9h.01" />
              <path d="m15 9-6 6" />
              <path d="M15 15h.01" />
            </motion.g>

            <motion.g variants={FRONT_SPLIT_VARIANTS}>
              <path
                d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
                stroke="none"
                className={cn("transition-colors duration-200", bgClassName)}
              />

              <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M9 9h.01" />
              <path d="m15 9-6 6" />
              <path d="M15 15h.01" />
            </motion.g>
          </motion.g>
        </svg>
      </div>
    );
  }
);

TicketPercentIcon.displayName = "TicketPercentIcon";

export { TicketPercentIcon };
