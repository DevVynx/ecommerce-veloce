import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const query = z.object({
  q: z.string().optional(),
  sortBy: z
    .enum(["name_asc", "name_desc", "recent", "oldest", "most_orders", "most_spent"])
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const searchCustomers = validation({ query });
