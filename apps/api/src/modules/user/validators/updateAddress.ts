import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const params = z.object({
  addressId: z.uuid("ID inválido."),
});

const body = z.object({
  receiverName: z
    .string()
    .min(1, "Informe o nome do destinatário.")
    .max(60, "O nome do destinatário não pode passar de 60 caracteres.")
    .optional(),
  label: z.string().max(30, "O rótulo do endereço não pode passar de 30 caracteres.").optional(),
  cep: z
    .string()
    .regex(/^\d{8}$/, "CEP deve conter exatamente 8 dígitos.")
    .optional(),
  street: z
    .string()
    .min(1, "Informe a rua.")
    .max(70, "O nome da rua não pode passar de 70 caracteres")
    .optional(),
  number: z.string().min(1, "Informe o número.").max(6, "Informe um número válido").optional(),
  complement: z.string().optional(),
  neighborhood: z
    .string()
    .min(1, "Informe o bairro.")
    .max(50, "O nome do bairro não pode passar de 50 caracteres")
    .optional(),
  city: z
    .string()
    .min(1, "Informe a cidade.")
    .max(50, "O nome da cidade não pode passar de 50 caracteres")
    .optional(),
  state: z.string().min(2, "Informe o estado.").max(2, "Estado inválido.").optional(),
});

export const updateAddress = validation({ params, body });
