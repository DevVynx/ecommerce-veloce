import { db } from "@/shared/lib/db";

type FindSuggestionsParams = {
  q?: string;
  limit: number;
};

export const findSuggestions = async ({ q, limit }: FindSuggestionsParams) => {
  const suggestions = await db.searchSuggestion.findMany({
    where: q ? { term: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { searchCount: "desc" },
    take: limit,
  });

  return suggestions;
};
