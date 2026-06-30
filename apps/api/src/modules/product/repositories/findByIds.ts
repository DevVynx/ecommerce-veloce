import { db } from "@/shared/lib/db";

import type { RawProductListItem } from "../types/ProductList";

export const findProductsByIds = async (ids: string[]): Promise<RawProductListItem[]> => {
  const now = new Date();

  const rawProducts = await db.product.findMany({
    where: {
      id: { in: ids },
      productVariants: { some: { isActive: true, stock: { gt: 0 } } },
    },
    include: {
      category: {
        select: {
          promotions: {
            where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
          },
        },
      },
      promotions: {
        where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
      },
      productVariants: {
        where: { isActive: true, stock: { gt: 0 } },
        select: {
          id: true,
          price: true,
          stock: true,
          isActive: true,
          promotions: {
            where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
          },
        },
      },
    },
  });

  const orderMap = new Map(rawProducts.map((p) => [p.id, p]));
  return ids.map((id) => orderMap.get(id)).filter(Boolean) as RawProductListItem[];
};
