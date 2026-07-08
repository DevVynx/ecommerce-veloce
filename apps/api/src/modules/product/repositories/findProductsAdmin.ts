import { db } from "@/shared/lib/db";

export const findProductsAdmin = async (ids: string[]) => {
  const products = await db.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      title: true,
      slug: true,
      image: true,
      totalStock: true,
      category: { select: { id: true, name: true } },
      productVariants: {
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          isActive: true,
          productVariantOptions: {
            select: {
              productOptionValue: {
                select: {
                  value: true,
                  productOption: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const orderMap = new Map(products.map((p) => [p.id, p]));
  return ids.map((id) => orderMap.get(id)).filter(Boolean) as typeof products;
};
