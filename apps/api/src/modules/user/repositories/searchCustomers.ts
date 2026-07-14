import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type SearchCustomersParams = {
  q?: string;
  sortBy?: "name_asc" | "name_desc" | "recent" | "oldest" | "most_orders" | "most_spent";
  page: number;
  limit: number;
};

function buildWhere(params: Pick<SearchCustomersParams, "q">) {
  const { q } = params;
  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

export const searchCustomers = async (params: SearchCustomersParams) => {
  const { sortBy, page, limit } = params;
  const where = buildWhere(params);
  const skip = (page - 1) * limit;

  const includeClause = {
    _count: { select: { orders: true } },
    orders: { select: { total: true } },
  } satisfies Prisma.UserInclude;

  if (sortBy === "most_orders" || sortBy === "most_spent") {
    const all = await db.user.findMany({
      where,
      include: includeClause,
    });

    all.sort((a, b) => {
      if (sortBy === "most_spent") {
        const aTotal = a.orders.reduce((sum, o) => sum + Number(o.total), 0);
        const bTotal = b.orders.reduce((sum, o) => sum + Number(o.total), 0);
        return bTotal - aTotal;
      }
      return b._count.orders - a._count.orders;
    });

    const total = all.length;
    const rows = all.slice(skip, skip + limit);

    return { customers: rows, total };
  }

  const orderBy: Prisma.UserOrderByWithRelationInput =
    sortBy === "name_asc"
      ? { name: "asc" }
      : sortBy === "name_desc"
        ? { name: "desc" }
        : sortBy === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" };

  const [total, rows] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: includeClause,
    }),
  ]);

  return { customers: rows, total };
};
