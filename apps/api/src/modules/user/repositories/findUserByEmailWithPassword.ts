import { db } from "@/shared/lib/db";

type FindUserByEmailWithPasswordProps = {
  email: string;
};

export const findUserByEmailWithPassword = async ({ email }: FindUserByEmailWithPasswordProps) => {
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      isEmailVerified: true,
      role: true,
    },
  });

  return user;
};
