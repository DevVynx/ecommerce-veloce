import z from "zod";

import { validation } from "@/shared/middlewares/validation";
import { dateString } from "@/shared/utils/validators";

const body = z.object({
  name: z.string().min(1, "Informe um nome."),
  type: z.enum(["PERCENTAGE", "FIXED"], { message: "Tipo de promoção inválido." }),
  discountValue: z.number().positive("Valor do desconto deve ser positivo."),
  isActive: z.boolean().optional().default(true),
  startsAt: dateString(),
  endsAt: dateString(),
  targetType: z.enum(["category", "product", "variant"], {
    message: "Tipo de alvo inválido.",
  }),
  targetId: z.string().uuid("ID do alvo inválido."),
});

export const createPromotion = validation({ body });
