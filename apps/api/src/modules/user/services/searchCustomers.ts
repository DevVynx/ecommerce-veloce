import type { AdminSearchCustomersRequest } from "@repo/types/contracts";

import { userRepositories } from "@/modules/user/repositories";

export const searchCustomers = async (params: AdminSearchCustomersRequest) => {
  const { q, sortBy, page = 1, limit = 10 } = params;

  const { customers: raw, total } = await userRepositories.searchCustomers({
    q,
    sortBy,
    page,
    limit,
  });

  const customers = raw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    orderCount: u._count.orders,
    totalSpent: Number(u.orders.reduce((sum, o) => sum + Number(o.total), 0)),
    createdAt: u.createdAt.toISOString(),
  }));

  return {
    customers,
    pagination: { total, page, totalPages: Math.ceil(total / limit) },
  };
};
