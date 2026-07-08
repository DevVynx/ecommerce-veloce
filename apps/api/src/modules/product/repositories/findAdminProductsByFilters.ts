import { db } from "@/shared/lib/db";

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

const select = {
  id: true,
  title: true,
  slug: true,
  image: true,
  totalStock: true,
  category: { select: { id: true, name: true } },
  productVariants: {
    select: {
      id: true,
      sku: true,
      price: true,
      stock: true,
      isActive: true,
      productVariantOptions: {
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

function buildWhere(params: Pick<Params, "q" | "categoryId" | "stockLt" | "isActive">) {
  const { q, categoryId, stockLt, isActive } = params;
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (stockLt !== undefined) {
    andConditions.push({
      productVariants: { some: { stock: { lt: stockLt }, isActive: true } },
    });
  } else if (isActive === true) {
    andConditions.push({
      productVariants: { some: { isActive: true } },
    });
  } else if (isActive === false) {
    andConditions.push({
      productVariants: { none: { isActive: true } },
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
  const skip = (page - 1) * limit;

  const total = await db.product.count({ where });

  if (total === 0) {
    return { products: [], total };
  }

  if (sortBy === "price_asc" || sortBy === "price_desc") {
    const allProducts = await db.product.findMany({
      where,
      select: {
        id: true,
        productVariants: {
          where: { isActive: true },
          select: { price: true },
        },
      },
    });

    const withMinPrice = allProducts.map((p) => ({
      id: p.id,
      minPrice:
        p.productVariants.length > 0
          ? Math.min(...p.productVariants.map((v) => Number(v.price)))
          : Infinity,
    }));

    withMinPrice.sort((a, b) =>
      sortBy === "price_asc" ? a.minPrice - b.minPrice : b.minPrice - a.minPrice
    );

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

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (sortBy) {
    case "stock_asc":
      orderBy = { totalStock: "asc" };
      break;
    case "stock_desc":
      orderBy = { totalStock: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
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
