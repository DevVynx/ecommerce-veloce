import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const query = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  q: z.string().optional(),
  status: z
    .enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED", "REFUNDED"])
    .optional(),
});

export const getAll = validation({ query });
