import { db } from "@/shared/lib/db";

type CountUsagesByUserProps = {
  couponId: string;
  userId: string;
};

export const countUsagesByUser = async ({ couponId, userId }: CountUsagesByUserProps) => {
  const count = await db.couponUsage.count({
    where: { couponId, userId },
  });

  return count;
};
