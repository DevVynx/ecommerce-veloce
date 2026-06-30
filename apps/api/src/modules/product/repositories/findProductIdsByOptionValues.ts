import { db } from "@/shared/lib/db";

export const findProductIdsByOptionValues = async (
  valueTexts: string[]
): Promise<{ productIds: string[] }> => {
  if (valueTexts.length === 0) return { productIds: [] };

  const products = await db.product.findMany({
    where: {
      AND: valueTexts.map((text) => ({
        productVariants: {
          some: {
            productVariantOptions: {
              some: {
                productOptionValue: { value: text },
              },
            },
          },
        },
      })),
    },
    select: { id: true },
  });

  return { productIds: products.map((p) => p.id) };
};
