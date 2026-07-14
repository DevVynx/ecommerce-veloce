import type { OrderStatus, Prisma } from "../../../../prisma/generated/client/client";
import { db } from "@/shared/lib/db";

type FindAllProps = {
  skip: number;
  take: number;
  sort: "asc" | "desc";
  q?: string;
  status?: OrderStatus;
};

export const findAll = async ({ skip, take, sort, q, status }: FindAllProps) => {
  const where: Prisma.OrderWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (q) {
    const orConditions: Prisma.OrderWhereInput[] = [
      { user: { name: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];

    const orderNumber = Number(q);
    if (!isNaN(orderNumber) && orderNumber > 0) {
      orConditions.push({ orderNumber: { equals: orderNumber } });
    }

    where.OR = orConditions;
  }

  const orders = await db.order.findMany({
    skip,
    take,
    where,
    orderBy: { createdAt: sort },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return orders;
};
