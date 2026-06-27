import { db } from "@/shared/lib/db";

type FindUserProfileProps = { userId: string };

export const findUserProfile = async ({ userId }: FindUserProfileProps) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  return user;
};
