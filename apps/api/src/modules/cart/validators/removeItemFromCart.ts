import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  cartItemId: z.uuid("Valor inválido."),
});

export const removeItemFromCart = validation({ params });
