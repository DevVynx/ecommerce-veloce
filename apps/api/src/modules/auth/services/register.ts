import bcrypt from "bcrypt";

import { generateAccessToken, generateRefreshToken } from "@/modules/auth/helpers/tokenGenerator";
import { RegisterParams } from "@/modules/auth/types/ServicesParams";
import { userServices } from "@/modules/user/services";
import { ConflictError } from "@/shared/utils/HttpErrors";

export const register = async ({ name, email, password }: RegisterParams) => {
  const existingUser = await userServices.findUserByEmail({ email });
  if (existingUser) {
    throw new ConflictError("Já existe um usuário com esse e-mail");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userServices.createUser({
    data: { name, email, password: hashedPassword },
  });

  const { googleId: _, ...userWithoutGoogleId } = user;

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  return { user: userWithoutGoogleId, accessToken, refreshToken };
};
