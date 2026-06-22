export type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export type ApplyCouponRequest = {
  code: string;
};

export type CreateCouponRequest = {
  code: string;
  type: CouponType;
  startsAt: string;
  endsAt: string;
  usageLimit: number;
  description?: string;
  value?: number;
  maxDiscount?: number | null;
  minOrderValue?: number;
  usageLimitPerUser?: number;
  isActive?: boolean;
};
