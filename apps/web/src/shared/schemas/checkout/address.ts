import z from "zod";

export const addressFormSchema = z.object({
  receiverName: z.string().min(1, "Nome do recebedor é obrigatório"),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras").toUpperCase(),
  complement: z.string().optional(),
  label: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
