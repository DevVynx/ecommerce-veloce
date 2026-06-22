import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  cartItemId: z.uuid("Valor inválido."),
});

const body = z.object({
  quantity: z.number("Valor inválido.").min(1, "A quantidade mínima é 1."),
});

export const updateCartItemQuantity = validation({ params, body });
