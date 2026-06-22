import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  cartId: z.uuid("Valor inválido."),
  destinyCep: z.string().max(8, "Valor inválido."),
});

export const quoteShipping = validation({ body });
