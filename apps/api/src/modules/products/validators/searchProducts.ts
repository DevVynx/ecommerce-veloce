import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const query = z.object({
  q: z.string().optional(),
  categoryId: z.uuid().optional(),
  onSale: z.coerce.boolean().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  optionValues: z.string().optional(),
  sortBy: z.enum(["price_asc", "price_desc", "rating_desc", "newest"]).optional(),
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().positive().max(100).default(16),
});

export const searchProducts = validation({ query });
