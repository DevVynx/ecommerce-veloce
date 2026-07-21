import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  id: z.string().uuid("ID inválido."),
});

export const deletePromotion = validation({ params });
