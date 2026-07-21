export type PromotionType = "PERCENTAGE" | "FIXED";

export type PromotionTargetType = "category" | "product" | "variant";

export type AdminSearchPromotionsRequest = {
  q?: string;
  isActive?: boolean;
  type?: PromotionType;
  targetType?: PromotionTargetType;
  sortBy?: "newest" | "oldest" | "expiring_soon" | "discount_desc" | "discount_asc";
  page?: number;
  limit?: number;
};

export type CreatePromotionRequest = {
  name: string;
  type: PromotionType;
  discountValue: number;
  isActive?: boolean;
  startsAt: string;
  endsAt: string;
  targetType: PromotionTargetType;
  targetId: string;
};

export type UpdatePromotionRequest = Partial<CreatePromotionRequest>;
