import { useCallback, useState } from "react";

const RECENT_SEARCHES_KEY = "recent_searches";

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(terms: string[]): void {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(terms));
  } catch {
    console.warn("Failed to save recent searches to localStorage");
  }
}

export function useSearchStorage(maxRecentSearches: number) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const loadRecentFromStorage = useCallback(() => {
    const recent = loadRecent();
    setRecentSearches(recent);
    return recent;
  }, []);

  const addToRecent = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      const recent = loadRecent();
      const filtered = recent.filter((t) => t !== term);
      saveRecent([term, ...filtered].slice(0, maxRecentSearches));
    },
    [maxRecentSearches]
  );

  const removeRecentSearch = useCallback((term: string) => {
    const recent = loadRecent();
    saveRecent(recent.filter((t) => t !== term));
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  }, []);

  return {
    recentSearches,
    setRecentSearches,
    loadRecentFromStorage,
    addToRecent,
    removeRecentSearch,
  };
}
