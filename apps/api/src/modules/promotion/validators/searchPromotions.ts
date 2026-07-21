import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const query = z.object({
  q: z.string().optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  targetType: z.enum(["category", "product", "variant"]).optional(),
  sortBy: z
    .enum(["newest", "oldest", "expiring_soon", "discount_desc", "discount_asc"])
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const searchPromotions = validation({ query });
