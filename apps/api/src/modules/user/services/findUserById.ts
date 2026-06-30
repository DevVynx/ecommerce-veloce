import { userRepositories } from "@/modules/user/repositories";
import type { FindUserByIdParams } from "@/modules/user/types/ServiceParams";

export const findUserById = async (params: FindUserByIdParams) => {
  const user = await userRepositories.findUserById(params);

  return user;
};
