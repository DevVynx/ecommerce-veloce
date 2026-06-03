"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type UseInfiniteScrollArgs = {
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => unknown;
  rootMargin?: string;
  disabled?: boolean;
  delayInMs?: number;
};

export function useInfiniteScroll({
  loading,
  hasNextPage,
  onLoadMore,
  rootMargin = "600px",
  disabled = false,
  delayInMs = 100,
}: UseInfiniteScrollArgs) {
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinelEl(node);
  }, []);

  const rootRef = useCallback((node: HTMLElement | null) => {
    setRootEl(node);
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sentinelEl) {
      setIsVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? false);
      },
      { root: rootEl, rootMargin }
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect();
  }, [sentinelEl, rootEl, rootMargin]);

  const shouldLoadMore = !disabled && !loading && isVisible && hasNextPage;

  useEffect(() => {
    if (!shouldLoadMore) return;
    const timer = setTimeout(() => onLoadMoreRef.current(), delayInMs);
    return () => clearTimeout(timer);
  }, [shouldLoadMore, delayInMs]);

  return [sentinelRef, { rootRef }] as const;
}
