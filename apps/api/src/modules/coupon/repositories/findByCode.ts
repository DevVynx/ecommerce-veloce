import { db } from "@/shared/lib/db";

type FindByCodeProps = {
  code: string;
};

export const findByCode = async ({ code }: FindByCodeProps) => {
  const coupon = await db.coupon.findUnique({
    where: { code },
  });

  return coupon;
};
