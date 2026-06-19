"use client";
import { Search } from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/utils/lib/utils";

import { SearchBarInput } from "./SearchBarInput";
import { SearchResults } from "./SearchResults";
import type { SearchBarProps } from "./types";
import { useSearchBar } from "./useSearchBar";

export const SearchBar = ({
  // Behavior
  fetchSuggestions,
  fetchTrending,
  onSelect,
  maxRecentSearches = 5,
  maxSuggestions = 10,
  maxTrending = 5,
  mobileTrigger = "input",

  // Appearance
  classNames,
  placeholder,

  // Data
  queryFromUrl,
}: SearchBarProps) => {
  const {
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
    handleKeyDown,
    handleInputChange,
    handleOverlayClick,
    handleItemClick,
    removeRecentSearch,
  } = useSearchBar({
    fetchSuggestions,
    fetchTrending,
    maxRecentSearches,
    maxSuggestions,
    maxTrending,
    onSelect,
    queryFromUrl,
  });

  const renderInput = (withRef: boolean) => {
    const commonProps = {
      value: query,
      onChange: handleInputChange,
      onKeyDown: handleKeyDown,
      onSearch: () => {
        if (query.trim()) handleItemClick(query);
      },
      placeholder,
      className: classNames?.input,
      searchButtonClassName: classNames?.searchButton,
    };

    if (withRef) {
      return <SearchBarInput ref={inputRef} onFocus={open} {...commonProps} />;
    }
    return <SearchBarInput {...commonProps} />;
  };

  return (
    <div className={cn("relative", classNames?.root)}>
      {mobileTrigger === "icon" ? (
        <>
          <div className="hidden lg:block">{renderInput(true)}</div>
          <button
            type="button"
            className={cn(
              "text-muted-foreground hover:text-foreground flex items-center justify-center p-2 transition-colors lg:hidden",
              classNames?.trigger
            )}
            onClick={open}
            aria-label="Abrir busca"
          >
            <Search className="h-5 w-5" />
          </button>
        </>
      ) : (
        <div className={cn(isOpen ? "hidden lg:block" : "block")}>{renderInput(true)}</div>
      )}

      {isOpen &&
        createPortal(
          <>
            {triggerRect ? (
              <div
                ref={dropdownRef}
                className="fixed z-50"
                style={{
                  top: triggerRect.bottom,
                  left: triggerRect.left,
                  width: triggerRect.width,
                }}
              >
                <div className="bg-popover mt-1 overflow-hidden rounded-lg border shadow-lg">
                  <div className="p-2">
                    <SearchResults
                      query={query}
                      isFetching={isFetching}
                      suggestions={suggestions}
                      recentSearches={recentSearches}
                      trending={trending}
                      activeIndex={activeIndex}
                      classNames={classNames}
                      onItemClick={handleItemClick}
                      onRemoveRecent={removeRecentSearch}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="fixed inset-0 z-40 bg-black/50" onClick={handleOverlayClick} />
                <div className="bg-background fixed inset-0 z-50 overflow-y-auto">
                  <div className="bg-background sticky top-0 z-10 flex items-center gap-2 border-b p-4">
                    <div className="flex-1">{renderInput(true)}</div>
                    <button
                      type="button"
                      onClick={close}
                      className={cn(
                        "text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors",
                        classNames?.closeButton
                      )}
                      aria-label="Fechar busca"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="p-2">
                    <SearchResults
                      query={query}
                      isFetching={isFetching}
                      suggestions={suggestions}
                      recentSearches={recentSearches}
                      trending={trending}
                      activeIndex={activeIndex}
                      classNames={classNames}
                      onItemClick={handleItemClick}
                      onRemoveRecent={removeRecentSearch}
                    />
                  </div>
                </div>
              </>
            )}
          </>,
          document.body
        )}
    </div>
  );
};
