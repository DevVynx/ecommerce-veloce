import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const query = z.object({
  q: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.coerce.boolean().optional(),
  stockLt: z.coerce.number().int().min(0).optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "stock_asc", "stock_desc", "newest", "oldest"])
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const searchAdmin = validation({ query });
