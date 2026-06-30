import { db } from "@/shared/lib/db";

type CountGlobalUsagesProps = {
  couponId: string;
};

export const countGlobalUsages = async ({ couponId }: CountGlobalUsagesProps) => {
  const count = await db.couponUsage.count({
    where: { couponId },
  });

  return count;
};
