import type { OrderStatus, Prisma } from "../../../../prisma/generated/client/client";
import { db } from "@/shared/lib/db";

type CountAllProps = {
  q?: string;
  status?: OrderStatus;
};

export const countAll = async ({ q, status }: CountAllProps = {}) => {
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

  return db.order.count({ where });
};
