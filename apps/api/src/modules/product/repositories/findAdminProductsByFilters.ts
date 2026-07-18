import { db } from "@/shared/lib/db";
import { productLogic } from "@/shared/utils/productLogic";

import type { Prisma } from "../../../../prisma/generated/client/client";

type Params = {
  q?: string;
  categoryId?: string;
  stockLt?: number;
  isActive?: boolean;
  sortBy?: string;
  page: number;
  limit: number;
};

function buildSelect(now: Date) {
  const activePromotions = { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } };

  return {
    id: true,
    title: true,
    slug: true,
    totalStock: true,
    promotions: { where: activePromotions, select: { type: true, discountValue: true } },
    category: {
      select: {
        id: true,
        name: true,
        promotions: { where: activePromotions, select: { type: true, discountValue: true } },
      },
    },
    productVariants: {
      select: {
        id: true,
        sku: true,
        price: true,
        stock: true,
        isActive: true,
        images: { select: { url: true } },
        promotions: { where: activePromotions, select: { type: true, discountValue: true } },
        optionValues: {
          select: {
            productOptionValue: {
              select: {
                value: true,
                productOption: { select: { name: true } },
              },
            },
          },
        },
      },
    },
  } satisfies Prisma.ProductSelect;
}

function buildWhere(params: Pick<Params, "q" | "categoryId" | "stockLt" | "isActive">) {
  const { q, categoryId, stockLt, isActive } = params;
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (stockLt !== undefined && isActive !== undefined) {
    andConditions.push({
      productVariants: { some: { stock: { lt: stockLt }, isActive } },
    });
  } else if (stockLt !== undefined) {
    andConditions.push({
      productVariants: { some: { stock: { lt: stockLt } } },
    });
  } else if (isActive === true) {
    andConditions.push({
      productVariants: { some: { isActive: true } },
    });
  } else if (isActive === false) {
    andConditions.push({
      productVariants: { some: { isActive: false } },
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (q) {
    andConditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { productVariants: { some: { sku: { contains: q, mode: "insensitive" } } } },
      ],
    });
  }

  return andConditions.length === 0
    ? {}
    : andConditions.length === 1
      ? andConditions[0]!
      : { AND: andConditions };
}

export const findAdminProductsByFilters = async (params: Params) => {
  const { sortBy, page, limit } = params;
  const where = buildWhere(params);
  const select = buildSelect(new Date());
  const skip = (page - 1) * limit;

  const total = await db.product.count({ where });

  if (total === 0) {
    return { products: [], total };
  }

  // In-memory sort: fetches all matching products to compute effective sale price per product,
  // then sorts in-memory. Alternative: materialized `minPrice` column on Product table.
  if (sortBy?.startsWith("price_")) {
    const activePromotions = {
      isActive: true,
      startsAt: { lte: new Date() },
      endsAt: { gte: new Date() },
    };

    const allProducts = await db.product.findMany({
      where,
      select: {
        id: true,
        promotions: { where: activePromotions, select: { type: true, discountValue: true } },
        category: {
          select: {
            promotions: { where: activePromotions, select: { type: true, discountValue: true } },
          },
        },
        productVariants: {
          where: { isActive: true },
          select: {
            price: true,
            promotions: { where: activePromotions, select: { type: true, discountValue: true } },
          },
        },
      },
    });

    const withMinPrice = allProducts.map((p) => {
      let minSale = Infinity;
      for (const v of p.productVariants) {
        const { salePrice } = productLogic.calculateEnrichment(
          { price: v.price, stock: 0, isActive: true },
          {
            variant: v.promotions,
            product: p.promotions,
            category: p.category.promotions,
          }
        );
        minSale = Math.min(minSale, Number(salePrice));
      }
      return { id: p.id, minPrice: minSale };
    });

    withMinPrice.sort((a, b) => {
      const diff = sortBy === "price_asc" ? a.minPrice - b.minPrice : b.minPrice - a.minPrice;
      return diff !== 0 ? diff : a.id.localeCompare(b.id);
    });

    const sortedIds = withMinPrice.slice(skip, skip + limit).map((p) => p.id);

    if (sortedIds.length === 0) return { products: [], total };

    const products = await db.product.findMany({
      where: { id: { in: sortedIds } },
      select,
    });

    const orderMap = new Map(products.map((p) => [p.id, p]));
    const ordered = sortedIds.map((id) => orderMap.get(id)).filter(Boolean) as typeof products;

    return { products: ordered, total };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }, { id: "asc" }];
  switch (sortBy) {
    case "stock_asc":
      orderBy = [{ totalStock: "asc" }, { id: "asc" }];
      break;
    case "stock_desc":
      orderBy = [{ totalStock: "desc" }, { id: "asc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }, { id: "asc" }];
      break;
    case "oldest":
      orderBy = [{ createdAt: "asc" }, { id: "asc" }];
      break;
  }

  const products = await db.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    select,
  });

  return { products, total };
};
