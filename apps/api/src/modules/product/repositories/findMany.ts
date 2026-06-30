import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type findManyProductsProps = {
  categoryId?: string;
  limit?: number;
  offset?: number;
  onlyAvailable?: boolean;
};

export const findManyProducts = async ({
  categoryId,
  limit,
  offset,
  onlyAvailable = true,
}: findManyProductsProps) => {
  const availabilityCriteria = {
    isActive: true,
    stock: { gt: 0 },
  };

  const whereClause: Prisma.ProductWhereInput = {
    ...(categoryId && { categoryId }),
    ...(onlyAvailable && {
      productVariants: { some: availabilityCriteria },
    }),
  };

  const now = new Date();

  const [rawProducts, total] = await db.$transaction([
    db.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            promotions: {
              where: {
                isActive: true,
                startsAt: { lte: now },
                endsAt: { gte: now },
              },
            },
          },
        },
        promotions: {
          where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
        },
        productVariants: {
          where: onlyAvailable ? availabilityCriteria : undefined,
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
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.product.count({ where: whereClause }),
  ]);

  return { rawProducts, total };
};
