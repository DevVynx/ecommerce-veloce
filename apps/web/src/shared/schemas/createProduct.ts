import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  description: z.string().min(1, "Descrição é obrigatória"),
  categoryId: z.string().uuid("Selecione uma categoria"),
  options: z
    .array(
      z.object({
        name: z.string().min(1, "Nome da opção é obrigatório"),
        values: z.array(z.string().min(1)).min(1, "Adicione ao menos um valor"),
      })
    )
    .min(1, "Adicione ao menos uma opção"),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1, "SKU é obrigatório").max(50),
        price: z.coerce.number().positive("Preço deve ser positivo").multipleOf(0.01),
        stock: z.coerce
          .number()
          .int("Deve ser inteiro")
          .nonnegative("Estoque não pode ser negativo"),
        weight: z.coerce.number().positive("Peso deve ser positivo").default(0.1),
        isActive: z.boolean().default(true),
        attributes: z.record(z.string(), z.string()),
      })
    )
    .min(1, "Adicione ao menos uma variante"),
});

export type CreateProductFormData = z.input<typeof createProductSchema>;
