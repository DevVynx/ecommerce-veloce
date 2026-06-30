import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  code: z
    .string()
    .min(1, "Informe um código.")
    .max(15, "Código muito longo.")
    .transform((s) => s.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"], { message: "Tipo de cupom inválido." }),
  description: z.string().optional(),
  value: z.number().int().min(0, "Valor não pode ser negativo.").optional().default(0),
  maxDiscount: z.number().positive("Valor máximo deve ser positivo.").optional(),
  minOrderValue: z.number().positive("Valor mínimo deve ser positivo.").optional().default(1),
  startsAt: z.iso.datetime("Data de início inválida."),
  endsAt: z.iso.datetime("Data de fim inválida."),
  usageLimit: z.number().int().positive("Limite deve ser positivo."),
  usageLimitPerUser: z
    .number()
    .int()
    .positive("Limite por usuário deve ser positivo.")
    .optional()
    .default(1),
  isActive: z.boolean().optional().default(true),
});

export const createCoupon = validation({ body });
