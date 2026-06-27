import { userRepositories } from "@/modules/user/repositories";
import type { FindAddressByIdParams } from "@/modules/user/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const findAddressById = async ({ addressId }: FindAddressByIdParams) => {
  const address = await userRepositories.findAddressById({ addressId });
  if (!address) throw new NotFoundError("Endereço não encontrado.");

  return { address };
};
