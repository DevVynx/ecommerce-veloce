import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  orderId: z.uuid("ID inválido."),
});

export const getOrderById = validation({ params });
