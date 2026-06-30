import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  productId: z.uuid("Valor Inválido"),
});

export const getById = validation({ params });
