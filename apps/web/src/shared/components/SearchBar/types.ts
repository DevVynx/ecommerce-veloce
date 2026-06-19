export type SearchSuggestion = {
  id: string;
  term: string;
};

export type SearchBarClassNames = {
  root?: string;
  trigger?: string;
  input?: string;
  section?: string;
  sectionTitle?: string;
  item?: string;
  itemIcon?: string;
  itemText?: string;
  closeButton?: string;
  searchButton?: string;
};

export type SearchBarProps = {
  fetchSuggestions: (query: string) => Promise<SearchSuggestion[]>;
  fetchTrending?: () => Promise<SearchSuggestion[]>;
  onSelect: (term: string) => void;

  classNames?: SearchBarClassNames;
  placeholder?: string;
  maxRecentSearches?: number;
  maxSuggestions?: number;
  maxTrending?: number;
  mobileTrigger?: "input" | "icon";

  /**
   * Valor da query vindo da URL (ex: "vestido"). Quando definido, sincroniza o
   * input com esse valor sempre que ele mudar, desde que o painel esteja fechado.
   * O pai é responsável por extrair da URL via useSearchParams().
   */
  queryFromUrl?: string;
};
