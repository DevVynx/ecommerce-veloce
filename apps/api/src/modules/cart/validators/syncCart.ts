import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  items: z.array(
    z.object({
      productVariantId: z.uuid(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const syncCart = validation({ body });
