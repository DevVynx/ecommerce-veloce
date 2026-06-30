import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z
  .object({
    addressId: z.uuid().optional(),
    shippingAddress: z
      .object({
        receiverName: z
          .string("Campo obrigatório.")
          .min(1, "Informe o nome do destinatário.")
          .max(60, "O nome do destinatário não pode passar de 60 caracteres."),
        cep: z.string("CEP inválido.").regex(/^\d{8}$/, "CEP deve conter exatamente 8 dígitos."),
        street: z
          .string("Campo obrigatório.")
          .min(1, "Informe a rua.")
          .max(70, "O nome da rua não pode passar de 70 caracteres"),
        number: z
          .string("Campo obrigatório.")
          .min(1, "Informe o número.")
          .max(6, "Informe um número válido"),
        complement: z.string().optional(),
        neighborhood: z
          .string("Campo obrigatório.")
          .min(1, "Informe o bairro.")
          .max(50, "O nome do bairro não pode passar de 50 caracteres"),
        city: z
          .string("Campo obrigatório.")
          .min(1, "Informe a cidade.")
          .max(50, "O nome da cidade não pode passar de 50 caracteres"),
        state: z
          .string("Campo obrigatório.")
          .min(2, "Informe o estado.")
          .max(2, "Estado inválido."),
      })
      .optional(),
    shippingService: z.string().min(1, "Selecione o frete."),
    paymentMethod: z.enum(["card", "pix"]),
  })
  .refine((data) => data.addressId || data.shippingAddress, {
    message: "Endereço é obrigatório",
  });

export const createOrder = validation({ body });
