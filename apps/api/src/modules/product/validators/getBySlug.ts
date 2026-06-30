import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  slug: z.string("Valor Inválido").min(1),
});

export const getBySlug = validation({ params });
