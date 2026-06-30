import { userRepositories } from "@/modules/user/repositories";
import type { UpdateUserByIdParams } from "@/modules/user/types/ServiceParams";

export const updateUserById = async (params: UpdateUserByIdParams) => {
  const user = await userRepositories.updateUserById(params);

  return user;
};
