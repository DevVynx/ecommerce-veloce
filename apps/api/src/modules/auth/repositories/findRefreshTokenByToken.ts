import { db } from "@/shared/lib/db";

type FindRefreshTokenByTokenProps = {
  token: string;
};

export const findRefreshTokenByToken = async ({ token }: FindRefreshTokenByTokenProps) => {
  const refreshToken = await db.refreshToken.findUnique({
    where: { token },
    select: {
      userId: true,
      isUsed: true,
      expiresAt: true,
    },
  });

  return refreshToken;
};
