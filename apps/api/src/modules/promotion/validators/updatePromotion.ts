import z from "zod";

import { validation } from "@/shared/middlewares/validation";
import { dateString } from "@/shared/utils/validators";

const params = z.object({
  id: z.string().uuid("ID inválido."),
});

const body = z.object({
  name: z.string().min(1, "Informe um nome.").optional(),
  type: z.enum(["PERCENTAGE", "FIXED"], { message: "Tipo de promoção inválido." }).optional(),
  discountValue: z.number().positive("Valor do desconto deve ser positivo.").optional(),
  isActive: z.boolean().optional(),
  startsAt: dateString().optional(),
  endsAt: dateString().optional(),
  targetType: z.enum(["category", "product", "variant"]).optional(),
  targetId: z.string().uuid("ID do alvo inválido.").optional(),
});

export const updatePromotion = validation({ params, body });
