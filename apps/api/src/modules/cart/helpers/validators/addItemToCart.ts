import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  productVariantId: z.uuid("Valor inválido."),
  quantity: z.number("Valor inválido.").min(1, "A quantidade mínima é 1."),
});

export const addItemToCart = validation({ body });
