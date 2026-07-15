import { searchRepositories } from "@/modules/search/repositories";

type SearchSuggestionsParams = {
  q?: string;
  limit: number;
};

export const searchSuggestions = async ({ q, limit }: SearchSuggestionsParams) => {
  const suggestions = await searchRepositories.findSuggestions({ q, limit });

  return { suggestions };
};
