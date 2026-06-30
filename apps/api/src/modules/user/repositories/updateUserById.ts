import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type UpdateUserByIdProps = {
  userId: string;
  data: Prisma.UserUpdateInput;
};

export const updateUserById = async ({ userId, data }: UpdateUserByIdProps) => {
  const user = await db.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      googleId: true,
      isEmailVerified: true,
      role: true,
    },
  });

  return user;
};
