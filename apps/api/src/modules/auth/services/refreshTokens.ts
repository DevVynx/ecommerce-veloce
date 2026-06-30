import { getTokenExpDate } from "@/modules/auth/helpers/getTokenExpDate";
import { generateAccessToken, generateRefreshToken } from "@/modules/auth/helpers/tokenGenerator";
import { authRepositories } from "@/modules/auth/repositories";
import { RefreshTokensParams } from "@/modules/auth/types/ServicesParams";
import { userServices } from "@/modules/user/services";
import { UnauthorizedError } from "@/shared/utils/HttpErrors";

export const refreshTokens = async ({ refreshToken }: RefreshTokensParams) => {
  const existingToken = await authRepositories.findRefreshTokenByToken({ token: refreshToken });

  if (!existingToken) {
    throw new UnauthorizedError("Token inválido.");
  }

  const user = await userServices.findUserById({ userId: existingToken.userId });

  if (!user) {
    throw new UnauthorizedError("O usuário pertencente ao token não existe.");
  }

  if (existingToken.isUsed === true) {
    await authRepositories.deleteManyRefreshTokensByUserId({ userId: user.id });
    throw new UnauthorizedError("Alerta de segurança: sessão comprometida.");
  }

  if (new Date() > existingToken.expiresAt) {
    await authRepositories.deleteRefreshTokenByToken({ refreshToken });
    throw new UnauthorizedError("Sessão expirada. Faça login novamente.");
  }

  await authRepositories.markRefreshTokenAsUsed({ token: refreshToken });

  const newAccessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id);

  await authRepositories.createRefreshToken({
    refreshToken: { token: newRefreshToken, expiresAt: getTokenExpDate(newRefreshToken) },
    userId: user.id,
  });

  return { accessToken: newAccessToken, newRefreshToken };
};
