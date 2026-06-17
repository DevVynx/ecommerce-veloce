import { db } from "@/shared/lib/db";

export const findCategoryNamesByIds = async (ids: string[]): Promise<Map<string, string>> => {
  const categories = await db.category.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });

  return new Map(categories.map((c) => [c.id, c.name]));
};
