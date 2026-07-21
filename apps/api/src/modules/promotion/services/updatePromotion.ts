import type { UpdatePromotionRequest } from "@repo/types/contracts";

import { promotionRepositories } from "@/modules/promotion/repositories";
import { db } from "@/shared/lib/db";
import { BadRequestError, NotFoundError } from "@/shared/utils/HttpErrors";

function getExistingTargetType(promotion: {
  categoryId: string | null;
  productId: string | null;
  variantId: string | null;
}): "category" | "product" | "variant" {
  return promotion.categoryId ? "category" : promotion.productId ? "product" : "variant";
}

function getExistingTargetId(promotion: {
  categoryId: string | null;
  productId: string | null;
  variantId: string | null;
}): string {
  return promotion.categoryId ?? promotion.productId ?? promotion.variantId ?? "";
}

async function validateTarget(targetType: string, targetId: string) {
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
}

export const updatePromotion = async (id: string, data: UpdatePromotionRequest) => {
  const existing = await promotionRepositories.findById(id);

  if (!existing) {
    throw new NotFoundError("Promoção não encontrada.");
  }

  // Validar que targetType e targetId vieram juntos
  if ((data.targetType && !data.targetId) || (!data.targetType && data.targetId)) {
    throw new BadRequestError("targetType e targetId devem ser informados juntos.");
  }

  const currentTargetType = getExistingTargetType(existing);
  const currentTargetId = getExistingTargetId(existing);

  const targetType = data.targetType ?? currentTargetType;
  const targetId = data.targetId ?? currentTargetId;

  // Validar novo target se houve mudança
  if (
    (data.targetType && data.targetType !== currentTargetType) ||
    (data.targetId && data.targetId !== currentTargetId)
  ) {
    await validateTarget(targetType, targetId);
  }

  const categoryId = targetType === "category" ? targetId : null;
  const productId = targetType === "product" ? targetId : null;
  const variantId = targetType === "variant" ? targetId : null;

  const promotion = await promotionRepositories.updatePromotion(id, {
    ...data,
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
