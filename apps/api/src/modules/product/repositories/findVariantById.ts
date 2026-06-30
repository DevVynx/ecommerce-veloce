import { db } from "@/shared/lib/db";

type findVariantByIdProps = {
  variantId: string;
};

export const findVariantById = async ({ variantId }: findVariantByIdProps) => {
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
  });

  return variant;
};
