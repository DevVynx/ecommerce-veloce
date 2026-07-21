import { db } from "@/shared/lib/db";

export const deletePromotion = async (id: string) => {
  await db.promotion.delete({ where: { id } });
};
