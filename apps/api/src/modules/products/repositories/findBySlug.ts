import { db } from "@/shared/lib/db";

type findProductBySlugProps = {
  slug: string;
};

export const findProductBySlug = async ({ slug }: findProductBySlugProps) => {
  const now = new Date();

  const product = await db.product.findFirst({
    where: { slug },
    include: {
      productOptions: { include: { values: true } },
      productVariants: {
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          isActive: true,
          productVariantOptions: { select: { productOptionValueId: true } },
          promotions: {
            where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          promotions: { where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } } },
        },
      },
      promotions: { where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } } },
    },
  });

  return product;
};
