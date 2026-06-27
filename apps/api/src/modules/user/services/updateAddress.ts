import { userRepositories } from "@/modules/user/repositories";
import type { UpdateAddressParams } from "@/modules/user/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const updateAddress = async ({ userId, addressId, ...data }: UpdateAddressParams) => {
  const existing = await userRepositories.findAddressById({ addressId });
  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Endereço não encontrado.");
  }

  const address = await userRepositories.updateAddress({ addressId, data });

  return { address };
};
