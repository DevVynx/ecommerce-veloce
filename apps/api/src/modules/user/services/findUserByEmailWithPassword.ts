import { userRepositories } from "@/modules/user/repositories";
import type { FindUserByEmailWithPasswordParams } from "@/modules/user/types/ServiceParams";

export const findUserByEmailWithPassword = async (params: FindUserByEmailWithPasswordParams) => {
  const user = await userRepositories.findUserByEmailWithPassword(params);

  return user;
};
