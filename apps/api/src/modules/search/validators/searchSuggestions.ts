import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const query = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(20).optional().default(5),
});

export const searchSuggestions = validation({ query });
