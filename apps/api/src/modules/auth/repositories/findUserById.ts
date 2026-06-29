import { db } from "@/shared/lib/db";

type FindUserByIdProps = {
  userId: string;
};

export const findUserById = async ({ userId }: FindUserByIdProps) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  return user;
};
