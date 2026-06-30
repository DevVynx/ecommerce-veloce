export const buildSearchFilters = (params: {
  categoryId?: string;
  onSale?: boolean;
  minRating?: number;
}): string[] => {
  const filters: string[] = [];

  if (params.categoryId) filters.push(`categoryId = "${params.categoryId}"`);
  if (params.onSale === true) filters.push("onSale = true");
  if (params.minRating != null) filters.push(`ratingRate >= ${params.minRating}`);

  return filters;
};
