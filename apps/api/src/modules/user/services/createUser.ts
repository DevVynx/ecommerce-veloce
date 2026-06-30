import { userRepositories } from "@/modules/user/repositories";
import type { CreateUserParams } from "@/modules/user/types/ServiceParams";

export const createUser = async (params: CreateUserParams) => {
  const user = await userRepositories.createUser(params);

  return user;
};
