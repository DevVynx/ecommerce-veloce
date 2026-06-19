import { useCallback, useEffect, useRef, useState } from "react";

import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

import type { SearchSuggestion } from "./types";
import { useSearchStorage } from "./useSearchStorage";

type UseSearchBarOptions = {
  fetchSuggestions: (query: string) => Promise<SearchSuggestion[]>;
  fetchTrending?: () => Promise<SearchSuggestion[]>;
  maxRecentSearches: number;
  maxSuggestions: number;
  maxTrending: number;
  onSelect: (term: string) => void;
  queryFromUrl?: string;
};

export function useSearchBar({
  fetchSuggestions,
  fetchTrending,
  maxRecentSearches,
  maxSuggestions,
  maxTrending,
  onSelect,
  queryFromUrl,
}: UseSearchBarOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [trending, setTrending] = useState<SearchSuggestion[]>([]);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const {
    recentSearches,
    setRecentSearches,
    loadRecentFromStorage,
    addToRecent,
    removeRecentSearch,
  } = useSearchStorage(maxRecentSearches);
  const [isFetching, setIsFetching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { isMobile } = useScreenSize();

  const hasQuery = query.trim().length > 0;
  const showSuggestionsOnly = hasQuery && suggestions.length > 0;
  const visibleItems = showSuggestionsOnly
    ? suggestions.length
    : recentSearches.length + trending.length;

  const open = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);

    if (isMobile) {
      setTriggerRect(null);
    } else {
      const rect = inputRef.current?.getBoundingClientRect() ?? null;
      setTriggerRect(rect && rect.width > 0 ? rect : null);
    }

    loadRecentFromStorage();

    if (fetchTrending) {
      fetchTrending()
        .then((items) => setTrending(items.slice(0, maxTrending)))
        .catch(() => setTrending([]));
    }
  }, [fetchTrending, isOpen, loadRecentFromStorage, maxTrending, isMobile]);

  const close = useCallback(() => {
    inputRef.current?.blur();
    setIsOpen(false);
    setActiveIndex(-1);
    setSuggestions([]);
    setTrending([]);
    setRecentSearches([]);
    setTriggerRect(null);
    setQuery("");
  }, []);

  const selectTerm = useCallback(
    (term: string) => {
      addToRecent(term);
      close();
      onSelect(term);
    },
    [addToRecent, close, onSelect]
  );

  useEffect(() => {
    if (!isOpen) return;

    if (query.trim().length === 0) {
      setSuggestions([]);
      setActiveIndex(-1);
      setIsFetching(false);
      return;
    }

    clearTimeout(debounceRef.current);
    setIsFetching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const items = await fetchSuggestions(query);
        setSuggestions(items.slice(0, maxSuggestions));
      } catch {
        setSuggestions([]);
      } finally {
        setIsFetching(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [query, isOpen, fetchSuggestions, maxSuggestions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < visibleItems - 1 ? prev + 1 : 0));
          break;

        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : visibleItems - 1));
          break;

        case "Enter": {
          e.preventDefault();
          if (activeIndex < 0) {
            selectTerm(query);
          } else if (showSuggestionsOnly) {
            selectTerm(suggestions[activeIndex]!.term);
          } else {
            const recentCount = recentSearches.length;

            if (activeIndex < recentCount) {
              selectTerm(recentSearches[activeIndex]!);
            } else if (activeIndex < recentCount + trending.length) {
              selectTerm(trending[activeIndex - recentCount]!.term);
            } else {
              selectTerm(query);
            }
          }
          break;
        }

        case "Escape":
          close();
          break;
      }
    },
    [
      isOpen,
      visibleItems,
      showSuggestionsOnly,
      recentSearches,
      trending,
      suggestions,
      activeIndex,
      selectTerm,
      close,
      query,
    ]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setActiveIndex(-1);

      if (!isOpen) {
        setIsOpen(true);

        if (!isMobile) {
          const rect = inputRef.current?.getBoundingClientRect() ?? null;
          setTriggerRect(rect && rect.width > 0 ? rect : null);
        }
      }
    },
    [isOpen, isMobile]
  );

  const handleOverlayClick = useCallback(() => {
    close();
  }, [close]);

  const handleItemClick = useCallback(
    (term: string) => {
      selectTerm(term);
    },
    [selectTerm]
  );

  useEffect(() => {
    if (queryFromUrl !== undefined && !isOpen) {
      setQuery(queryFromUrl);
    }
  }, [queryFromUrl, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen || !triggerRect) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, triggerRect, close]);

  useEffect(() => {
    if (!isOpen || !triggerRect) return;

    const handleScroll = () => {
      inputRef.current?.blur();
      setIsOpen(false);
      setActiveIndex(-1);
      setSuggestions([]);
      setTrending([]);
      setRecentSearches([]);
      setTriggerRect(null);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, triggerRect, close]);

  return {
    isOpen,
    query,
    activeIndex,
    triggerRect,
    isFetching,
    suggestions,
    trending,
    recentSearches,
    inputRef,
    dropdownRef,
    open,
    close,
    setQuery,
    handleKeyDown,
    handleInputChange,
    handleOverlayClick,
    handleItemClick,
    removeRecentSearch,
  };
}
