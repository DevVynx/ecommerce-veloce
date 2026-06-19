import { Clock, Search, TrendingUp } from "lucide-react";

import { SearchBarItem } from "./SearchBarItem";
import { SearchBarSection } from "./SearchBarSection";
import type { SearchBarClassNames, SearchSuggestion } from "./types";

type SearchResultsProps = {
  query: string;
  isFetching: boolean;
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  trending: SearchSuggestion[];
  activeIndex: number;
  classNames?: Pick<
    SearchBarClassNames,
    "section" | "sectionTitle" | "item" | "itemIcon" | "itemText"
  >;
  onItemClick: (term: string) => void;
  onRemoveRecent: (term: string) => void;
};

export function SearchResults({
  query,
  isFetching,
  suggestions,
  recentSearches,
  trending,
  activeIndex,
  classNames,
  onItemClick,
  onRemoveRecent,
}: SearchResultsProps) {
  const hasQuery = query.trim().length > 0;
  const recentEnd = recentSearches.length;
  const getGlobalIndex = (sectionStart: number, localIndex: number) => sectionStart + localIndex;

  if (hasQuery && !isFetching && suggestions.length === 0) {
    return (
      <div className="text-muted-foreground px-3 py-8 text-center text-sm">
        Nenhum resultado encontrado.
      </div>
    );
  }

  if (hasQuery && suggestions.length > 0) {
    return (
      <SearchBarSection
        title="Sugestões"
        className={classNames?.section}
        titleClassName={classNames?.sectionTitle}
      >
        {suggestions.map((item, i) => (
          <SearchBarItem
            key={`suggestion-${item.id}`}
            icon={<Search className="h-4 w-4" />}
            text={item.term}
            isActive={activeIndex === i}
            onClick={() => onItemClick(item.term)}
            highlightQuery={query}
            className={classNames?.item}
            iconClassName={classNames?.itemIcon}
            textClassName={classNames?.itemText}
          />
        ))}
      </SearchBarSection>
    );
  }

  return (
    <>
      {recentSearches.length > 0 && (
        <SearchBarSection
          title="Últimas buscas"
          className={classNames?.section}
          titleClassName={classNames?.sectionTitle}
        >
          {recentSearches.map((term, i) => (
            <SearchBarItem
              key={`recent-${term}`}
              icon={<Clock className="h-4 w-4" />}
              text={term}
              isActive={activeIndex === getGlobalIndex(0, i)}
              onClick={() => onItemClick(term)}
              onRemove={() => onRemoveRecent(term)}
              className={classNames?.item}
              iconClassName={classNames?.itemIcon}
              textClassName={classNames?.itemText}
            />
          ))}
        </SearchBarSection>
      )}

      {trending.length > 0 && (
        <SearchBarSection
          title="Tendências"
          className={classNames?.section}
          titleClassName={classNames?.sectionTitle}
        >
          {trending.map((item, i) => (
            <SearchBarItem
              key={`trending-${item.id}`}
              icon={<TrendingUp className="h-4 w-4" />}
              text={item.term}
              isActive={activeIndex === getGlobalIndex(recentEnd, i)}
              onClick={() => onItemClick(item.term)}
              className={classNames?.item}
              iconClassName={classNames?.itemIcon}
              textClassName={classNames?.itemText}
            />
          ))}
        </SearchBarSection>
      )}
    </>
  );
}
