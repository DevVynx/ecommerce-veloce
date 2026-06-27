import { NotFoundError } from "@/shared/utils/HttpErrors";

import { userRepositories } from "../repositories";

type GetProfileParams = { userId: string };

export const getProfile = async ({ userId }: GetProfileParams) => {
  const user = await userRepositories.findUserProfile({ userId });

  if (!user) throw new NotFoundError("Usuário não encontrado.");

  return { user };
};
