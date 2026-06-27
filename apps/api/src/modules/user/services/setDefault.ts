import { userRepositories } from "@/modules/user/repositories";
import type { SetDefaultAddressParams } from "@/modules/user/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const setDefault = async ({ userId, addressId }: SetDefaultAddressParams) => {
  const existing = await userRepositories.findAddressById({ addressId });

  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Endereço não encontrado.");
  }

  const address = await userRepositories.setDefaultAddress({ userId, addressId });

  return { address };
};
