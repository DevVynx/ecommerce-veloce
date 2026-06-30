import { userRepositories } from "@/modules/user/repositories";
import type { FindUserByEmailParams } from "@/modules/user/types/ServiceParams";

export const findUserByEmail = async (params: FindUserByEmailParams) => {
  const user = await userRepositories.findUserByEmail(params);

  return user;
};
