import { db } from "@/shared/lib/db";

export const findById = async (id: string) => {
  return db.promotion.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      product: { select: { id: true, title: true } },
      variant: { select: { id: true, sku: true } },
    },
  });
};
