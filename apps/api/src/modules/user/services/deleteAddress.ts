import { addressRepositories } from "@/modules/user/repositories";
import type { DeleteAddressParams } from "@/modules/user/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const deleteAddress = async ({ userId, addressId }: DeleteAddressParams) => {
  const existing = await addressRepositories.findByAddressId({ addressId });

  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Endereço não encontrado.");
  }

  await addressRepositories.deleteAddress({ addressId });
};
