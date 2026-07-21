import type { PromotionTargetType, PromotionType } from "./Requests";

export type AdminPromotionDto = {
  id: string;
  name: string;
  type: PromotionType;
  discountValue: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  targetType: PromotionTargetType;
  targetName: string;
  targetId: string;
};

export type AdminSearchPromotionsResponse = {
  promotions: AdminPromotionDto[];
  pagination: { total: number; page: number; totalPages: number };
};

export type CreatePromotionResponse = {
  promotion: AdminPromotionDto;
};

export type UpdatePromotionResponse = {
  promotion: AdminPromotionDto;
};

export type DeletePromotionResponse = void;
