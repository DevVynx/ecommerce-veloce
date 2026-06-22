import { db } from "@/shared/lib/db";

export type CreateCouponProps = {
  code: string;
  description: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  maxDiscount?: number | null;
  minOrderValue: number;
  startsAt: string;
  endsAt: string;
  usageLimit: number;
  usageLimitPerUser: number;
  isActive: boolean;
};

export const create = async (data: CreateCouponProps) => {
  return db.coupon.create({
    data: {
      code: data.code,
      description: data.description,
      type: data.type,
      value: data.value,
      maxDiscount: data.maxDiscount,
      minOrderValue: data.minOrderValue,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      usageLimit: data.usageLimit,
      usageLimitPerUser: data.usageLimitPerUser,
      isActive: data.isActive,
    },
  });
};
