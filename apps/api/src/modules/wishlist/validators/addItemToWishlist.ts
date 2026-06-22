import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  productId: z.uuid("Valor inválido."),
});

export const addItemToWishlist = validation({ body });
