import { db } from "@/shared/lib/db";

export const findAllCategories = async () => {
  return db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, image: true },
  });
};
