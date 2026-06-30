import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type CreateUserProps = {
  data: Prisma.UserCreateInput;
};

export const createUser = async ({ data }: CreateUserProps) => {
  const user = await db.user.create({
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
