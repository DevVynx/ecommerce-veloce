import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  addressId: z.uuid("ID inválido."),
});

export const setDefault = validation({ params });
