import { db } from "@/shared/lib/db";

type FindUserByEmailProps = {
  email: string;
};

export const findUserByEmail = async ({ email }: FindUserByEmailProps) => {
  const user = await db.user.findUnique({
    where: { email },
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
