import { db } from "@/shared/lib/db";

type FindManyByUserIdProps = {
  userId: string;
};

export const findManyByUserId = async ({ userId }: FindManyByUserIdProps) => {
  const addresses = await db.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return addresses;
};
