import { addressRepositories } from "@/modules/user/repositories";
import type { CreateAddressParams } from "@/modules/user/types/ServiceParams";

export const createAddress = async ({ userId, ...data }: CreateAddressParams) => {
  const existing = await addressRepositories.findManyByUserId({ userId });

  const address = await addressRepositories.createAddress({
    data: {
      ...data,
      isDefault: existing.length === 0,
      user: { connect: { id: userId } },
    },
  });

  return { address };
};
