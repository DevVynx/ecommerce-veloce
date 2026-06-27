import { db } from "@/shared/lib/db";

type FindAddressesByUserIdProps = {
  userId: string;
};

export const findAddressesByUserId = async ({ userId }: FindAddressesByUserIdProps) => {
  const addresses = await db.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return addresses;
};
