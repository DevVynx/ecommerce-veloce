import { LoginRequest, RegisterRequest } from "@repo/types/contracts";

export type LoginParams = LoginRequest;

export type LogoutParams = {
  userId: string;
};

export type RegisterParams = Omit<RegisterRequest, "confirmPassword">;

export type RefreshTokensParams = {
  refreshToken: string;
};

export type GoogleAuthParams = {
  code: string;
};
