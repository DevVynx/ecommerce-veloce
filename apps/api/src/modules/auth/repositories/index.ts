import { createRefreshToken } from "@/modules/auth/repositories/createRefreshToken";
import { deleteExpiredRefreshTokens } from "@/modules/auth/repositories/deleteExpiredRefreshTokens";
import { deleteManyRefreshTokensByUserId } from "@/modules/auth/repositories/deleteManyRefreshTokensByUserId";
import { deleteRefreshTokenByToken } from "@/modules/auth/repositories/deleteRefreshTokenByToken";
import { findRefreshTokenByToken } from "@/modules/auth/repositories/findRefreshTokenByToken";
import { markRefreshTokenAsUsed } from "@/modules/auth/repositories/markRefreshTokenAsUsed";

export const authRepositories = {
  findRefreshTokenByToken,
  createRefreshToken,
  markRefreshTokenAsUsed,
  deleteManyRefreshTokensByUserId,
  deleteRefreshTokenByToken,
  deleteExpiredRefreshTokens,
};
