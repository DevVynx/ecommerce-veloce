import type { CreateProductRequest } from "@repo/types/contracts";

import { db } from "@/shared/lib/db";

type CreateProductReturn = {
  id: string;
  name: string;
  variantsCount: number;
};

export const createProduct = async (
  data: CreateProductRequest & { slug: string }
): Promise<CreateProductReturn> => {
  return await db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        slug: data.slug,
        title: data.name,
        description: data.description,
        categoryId: data.categoryId,
        totalStock: 0,
        productOptions: {
          create: data.options.map((opt) => ({
            name: opt.name,
            values: {
              create: opt.values.map((val) => ({ value: val })),
            },
          })),
        },
      },
      include: {
        productOptions: {
          include: { values: true },
        },
      },
    });

    const valueMap = new Map<string, string>();
    for (const opt of product.productOptions) {
      for (const val of opt.values) {
        valueMap.set(`${opt.name}::${val.value}`, val.id);
      }
    }

    let totalStock = 0;

    for (const variant of data.variants) {
      const optionValueIds = Object.entries(variant.attributes).map(([optName, optValue]) => {
        const id = valueMap.get(`${optName}::${optValue}`);
        if (!id) {
          throw new Error(`Valor de opção "${optValue}" não encontrado para "${optName}"`);
        }
        return id;
      });

      await tx.productVariant.create({
        data: {
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          weight: variant.weight,
          isActive: variant.isActive,
          productId: product.id,
          optionValues: {
            create: optionValueIds.map((id) => ({
              productOptionValueId: id,
            })),
          },
          images: {
            create: variant.images.map((img) => ({
              url: img.url,
              publicId: img.publicId,
            })),
          },
        },
      });

      totalStock += variant.stock;
    }

    await tx.product.update({
      where: { id: product.id },
      data: { totalStock },
    });

    return {
      id: product.id,
      name: data.name,
      variantsCount: data.variants.length,
    };
  });
};
