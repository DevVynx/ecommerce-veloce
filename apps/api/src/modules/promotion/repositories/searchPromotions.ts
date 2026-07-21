import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type SearchPromotionsParams = {
  q?: string;
  isActive?: boolean;
  type?: "PERCENTAGE" | "FIXED";
  targetType?: "category" | "product" | "variant";
  sortBy?: "newest" | "oldest" | "expiring_soon" | "discount_desc" | "discount_asc";
  page: number;
  limit: number;
};

function buildWhere(params: Pick<SearchPromotionsParams, "q" | "isActive" | "type" | "targetType">) {
  const { q, isActive, type, targetType } = params;
  const where: Prisma.PromotionWhereInput = {};

  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (type) {
    where.type = type;
  }

  if (targetType === "category") {
    where.categoryId = { not: null };
    where.productId = null;
    where.variantId = null;
  } else if (targetType === "product") {
    where.categoryId = null;
    where.productId = { not: null };
    where.variantId = null;
  } else if (targetType === "variant") {
    where.categoryId = null;
    where.productId = null;
    where.variantId = { not: null };
  }

  return where;
}

export const searchPromotions = async (params: SearchPromotionsParams) => {
  const { sortBy, page, limit } = params;
  const where = buildWhere(params);
  const skip = (page - 1) * limit;

  const orderBy: Prisma.PromotionOrderByWithRelationInput =
    sortBy === "oldest"
      ? { createdAt: "asc" }
      : sortBy === "expiring_soon"
        ? { endsAt: "asc" }
        : sortBy === "discount_desc"
          ? { discountValue: "desc" }
          : sortBy === "discount_asc"
            ? { discountValue: "asc" }
            : { createdAt: "desc" };

  const [total, rows] = await Promise.all([
    db.promotion.count({ where }),
    db.promotion.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: { select: { id: true, name: true } },
        product: { select: { id: true, title: true } },
        variant: { select: { id: true, sku: true } },
      },
    }),
  ]);

  return { promotions: rows, total };
};
