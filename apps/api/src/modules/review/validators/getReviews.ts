import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const query = z.object({
  offset: z.coerce.number("Valor Inválido").nonnegative().default(0),
  limit: z.coerce.number("Valor Inválido").positive().max(100).default(10),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(["newest", "relevant"]).optional(),
});

const params = z.object({
  productId: z.uuid("Valor Inválido"),
});

export const getReviews = validation({ query, params });
