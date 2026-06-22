import type { ApplyCouponRequest, CreateCouponRequest } from "@repo/types/contracts";

export type ValidateCouponParams = {
  userId: string;
} & ApplyCouponRequest;

export type CreateCouponParams = CreateCouponRequest;
