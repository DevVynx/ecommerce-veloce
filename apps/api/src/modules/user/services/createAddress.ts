import { userRepositories } from "@/modules/user/repositories";
import type { CreateAddressParams } from "@/modules/user/types/ServiceParams";

export const createAddress = async ({ userId, ...data }: CreateAddressParams) => {
  const existing = await userRepositories.findAddressesByUserId({ userId });

  const address = await userRepositories.createAddress({
    data: {
      ...data,
      isDefault: existing.length === 0,
      user: { connect: { id: userId } },
    },
  });

  return { address };
};
