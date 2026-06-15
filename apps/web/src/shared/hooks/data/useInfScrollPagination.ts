"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { useInfiniteScroll } from "@/shared/hooks/ui/useInfiniteScroll";

export type PaginatePayload<T> = Promise<{
  items: readonly T[];
  hasMore: boolean;
  total?: number;
}>;

type UseInfScrollPaginationArgs<T> = {
  action: (offset: number, limit: number) => PaginatePayload<T>;
  limit: number;
  initialItems?: T[];
  initialHasMore?: boolean;
  initialTotal?: number;
  resetKey?: string;
};

type UseInfScrollPaginationResult<T> = {
  sentinelRef: (node: HTMLDivElement | null) => void;
  rootRef: (node: HTMLElement | null) => void;
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  total: number;
  error: string | null;
  loadMore: () => Promise<void>;
};

export function useInfScrollPagination<T>({
  action,
  limit,
  initialItems = [],
  initialHasMore = true,
  initialTotal = 0,
  resetKey,
}: UseInfScrollPaginationArgs<T>): UseInfScrollPaginationResult<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(initialItems.length);

  const actionRef = useRef(action);
  actionRef.current = action;

  useEffect(() => {
    setItems(initialItems);
    offsetRef.current = initialItems.length;
    setHasMore(initialHasMore);
    setTotal(initialTotal);
    setError(null);
    setIsLoading(false);
  }, [resetKey, initialItems, initialHasMore, initialTotal]);

  const loadMore = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await actionRef.current(offsetRef.current, limit);
      setItems((prev) => [...prev, ...data.items]);
      offsetRef.current += data.items.length;

      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(data.hasMore);
      }

      if (data.total !== undefined) setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao carregar.");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  const [sentinelRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
  });

  return { sentinelRef, rootRef, items, isLoading, hasMore, total, error, loadMore };
}
