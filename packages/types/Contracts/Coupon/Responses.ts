import type { CouponType } from "./Requests";

export type ApplyCouponResponse = {
  coupon: {
    code: string;
    description: string;
    type: CouponType;
  };
  discountValue: number;
};

export type CreateCouponResponse = {
  coupon: {
    id: string;
    code: string;
    description: string;
    type: CouponType;
    value: number;
    maxDiscount: number | null;
    minOrderValue: number;
    startsAt: Date;
    endsAt: Date;
    usageLimit: number;
    usageLimitPerUser: number;
    isActive: boolean;
  };
};
