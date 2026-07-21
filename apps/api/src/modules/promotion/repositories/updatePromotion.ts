import { db } from "@/shared/lib/db";

type UpdatePromotionData = {
  name?: string;
  type?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
  categoryId?: string | null;
  productId?: string | null;
  variantId?: string | null;
};

export const updatePromotion = async (id: string, data: UpdatePromotionData) => {
  const parsed: Record<string, unknown> = {};

  if (data.name !== undefined) parsed.name = data.name;
  if (data.type !== undefined) parsed.type = data.type;
  if (data.discountValue !== undefined) parsed.discountValue = data.discountValue;
  if (data.isActive !== undefined) parsed.isActive = data.isActive;
  if (data.startsAt !== undefined) parsed.startsAt = new Date(data.startsAt);
  if (data.endsAt !== undefined) parsed.endsAt = new Date(data.endsAt);
  if (data.categoryId !== undefined) parsed.categoryId = data.categoryId;
  if (data.productId !== undefined) parsed.productId = data.productId;
  if (data.variantId !== undefined) parsed.variantId = data.variantId;

  return db.promotion.update({
    where: { id },
    data: parsed,
    include: {
      category: { select: { id: true, name: true } },
      product: { select: { id: true, title: true } },
      variant: { select: { id: true, sku: true } },
    },
  });
};
