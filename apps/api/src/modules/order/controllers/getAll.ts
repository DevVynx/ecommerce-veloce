import type { OrderStatus } from "../../../../prisma/generated/client/enums";
import type { AdminListOrdersResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { orderMappers } from "@/modules/order/mappers";
import { orderServices } from "@/modules/order/services";
import v from "@/modules/order/validators";

export const getAll: RequestHandler = async (req, res: Response<AdminListOrdersResponse>) => {
  const { page, limit, sort, q, status } = v.getAll.getValidatedValues(req).query;

  const { orders, pagination } = await orderServices.getAll({
    page,
    limit,
    sort,
    q,
    status: status as OrderStatus | undefined,
  });

  res.json({
    orders: orders.map(orderMappers.toAdminOrderDto),
    pagination,
  });
};
