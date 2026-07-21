import type { CreatePromotionRequest } from "@repo/types/contracts";

import { promotionRepositories } from "@/modules/promotion/repositories";
import { db } from "@/shared/lib/db";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const createPromotion = async (params: CreatePromotionRequest) => {
  const { name, type, discountValue, isActive, startsAt, endsAt, targetType, targetId } = params;

  if (targetType === "category") {
    const category = await db.category.findUnique({ where: { id: targetId } });
    if (!category) throw new NotFoundError("Categoria não encontrada.");
  } else if (targetType === "product") {
    const product = await db.product.findUnique({ where: { id: targetId } });
    if (!product) throw new NotFoundError("Produto não encontrado.");
  } else if (targetType === "variant") {
    const variant = await db.productVariant.findUnique({ where: { id: targetId } });
    if (!variant) throw new NotFoundError("Variante não encontrada.");
  }

  const categoryId = targetType === "category" ? targetId : null;
  const productId = targetType === "product" ? targetId : null;
  const variantId = targetType === "variant" ? targetId : null;

  const promotion = await promotionRepositories.createPromotion({
    name,
    type,
    discountValue,
    isActive: isActive ?? true,
    startsAt,
    endsAt,
    categoryId,
    productId,
    variantId,
  });

  const mappedTargetType: "category" | "product" | "variant" = promotion.categoryId
    ? "category"
    : promotion.productId
      ? "product"
      : "variant";
  const targetName = promotion.variant?.sku ?? promotion.product?.title ?? promotion.category?.name ?? "";
  const mappedTargetId = promotion.variant?.id ?? promotion.product?.id ?? promotion.category?.id ?? "";

  return {
    promotion: {
      id: promotion.id,
      name: promotion.name,
      type: promotion.type,
      discountValue: Number(promotion.discountValue),
      isActive: promotion.isActive,
      startsAt: promotion.startsAt.toISOString(),
      endsAt: promotion.endsAt.toISOString(),
      targetType: mappedTargetType,
      targetName,
      targetId: mappedTargetId,
    },
  };
};
