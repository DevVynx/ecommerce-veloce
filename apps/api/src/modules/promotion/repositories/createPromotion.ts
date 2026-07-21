import { db } from "@/shared/lib/db";

type CreatePromotionProps = {
  name: string;
  type: "PERCENTAGE" | "FIXED";
  discountValue: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  categoryId: string | null;
  productId: string | null;
  variantId: string | null;
};

export const createPromotion = async (data: CreatePromotionProps) => {
  return db.promotion.create({
    data: {
      name: data.name,
      type: data.type,
      discountValue: data.discountValue,
      isActive: data.isActive,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      categoryId: data.categoryId,
      productId: data.productId,
      variantId: data.variantId,
    },
    include: {
      category: { select: { id: true, name: true } },
      product: { select: { id: true, title: true } },
      variant: { select: { id: true, sku: true } },
    },
  });
};
