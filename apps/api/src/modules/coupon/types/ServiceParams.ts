import type { ApplyCouponRequest, CouponType, CreateCouponRequest } from "@repo/types/contracts";

export type ValidateCouponParams = {
  userId: string;
} & ApplyCouponRequest;

export type CreateCouponParams = CreateCouponRequest;

export type UpdateCouponData = {
  code?: string;
  type?: CouponType;
  description?: string;
  value?: number;
  maxDiscount?: number | null;
  minOrderValue?: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  usageLimitPerUser?: number;
  isActive?: boolean;
};
