import type { OrderStatus } from "../../../../prisma/generated/client/enums";
import { orderRepositories } from "@/modules/order/repositories";

type GetAllOrdersParams = {
  page: number;
  limit: number;
  sort: "asc" | "desc";
  q?: string;
  status?: OrderStatus;
};

export const getAll = async ({ page, limit, sort, q, status }: GetAllOrdersParams) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    orderRepositories.findAll({ skip, take: limit, sort, q, status }),
    orderRepositories.countAll({ q, status }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { orders, pagination: { total, page, totalPages } };
};
