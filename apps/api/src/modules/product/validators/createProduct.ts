import { z } from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  categoryId: z.string().uuid(),
  options: z.array(
    z.object({
      name: z.string().min(1),
      values: z.array(z.string().min(1)).min(1),
    })
  ),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1).max(50),
        price: z.coerce.number().positive().multipleOf(0.01),
        stock: z.number().int().nonnegative(),
        weight: z.coerce.number().positive(),
        isActive: z.boolean(),
        attributes: z.record(z.string(), z.string()),
        images: z
          .array(
            z.object({
              url: z.string().url(),
              publicId: z.string().min(1),
            })
          )
          .min(1),
      })
    )
    .min(1),
});

export const createProduct = validation({ body });
