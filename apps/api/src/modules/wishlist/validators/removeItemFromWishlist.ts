import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  productId: z.uuid("Valor inválido."),
});

export const removeItemFromWishlist = validation({ params });
