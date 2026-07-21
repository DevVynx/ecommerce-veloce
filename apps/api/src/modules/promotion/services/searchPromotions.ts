import type { AdminSearchPromotionsRequest } from "@repo/types/contracts";

import { promotionRepositories } from "@/modules/promotion/repositories";

export const searchPromotions = async (params: AdminSearchPromotionsRequest) => {
  const { q, isActive, type, targetType, sortBy, page = 1, limit = 20 } = params;

  const { promotions: raw, total } = await promotionRepositories.searchPromotions({
    q,
    isActive,
    type,
    targetType,
    sortBy,
    page,
    limit,
  });

  const promotions = raw.map((p) => {
    const targetType: "category" | "product" | "variant" = p.categoryId
      ? "category"
      : p.productId
        ? "product"
        : "variant";
    const targetName = p.variant?.sku ?? p.product?.title ?? p.category?.name ?? "";
    const targetId = p.variant?.id ?? p.product?.id ?? p.category?.id ?? "";

    return {
      id: p.id,
      name: p.name,
      type: p.type,
      discountValue: Number(p.discountValue),
      isActive: p.isActive,
      startsAt: p.startsAt.toISOString(),
      endsAt: p.endsAt.toISOString(),
      targetType,
      targetName,
      targetId,
    };
  });

  return {
    promotions,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};
