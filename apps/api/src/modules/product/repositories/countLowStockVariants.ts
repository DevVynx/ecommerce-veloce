import { db } from "@/shared/lib/db";

export const countLowStockVariants = async () => {
  return db.productVariant.count({
    where: {
      stock: { lt: 6 },
      isActive: true,
    },
  });
};
