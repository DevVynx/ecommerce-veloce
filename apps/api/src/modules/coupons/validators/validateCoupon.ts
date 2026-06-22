import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  code: z.string("Código inválido.").min(1, "Informe um cupom.").max(15, "Código muito longo."),
});

export const validateCoupon = validation({ body });
