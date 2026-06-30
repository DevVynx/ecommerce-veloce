import { db } from "@/shared/lib/db";

type findVariantByIdWithProductProps = {
  variantId: string;
};

export const findVariantByIdWithProduct = async ({
  variantId,
}: findVariantByIdWithProductProps) => {
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  return variant;
};
