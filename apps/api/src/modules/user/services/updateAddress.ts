import { addressRepositories } from "@/modules/user/repositories";
import type { UpdateAddressParams } from "@/modules/user/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const updateAddress = async ({ userId, addressId, ...data }: UpdateAddressParams) => {
  const existing = await addressRepositories.findByAddressId({ addressId });
  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Endereço não encontrado.");
  }

  const address = await addressRepositories.update({ addressId, data });

  return { address };
};
