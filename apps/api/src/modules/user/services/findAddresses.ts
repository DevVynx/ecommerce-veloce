import { userRepositories } from "@/modules/user/repositories";
import type { FindAddressesParams } from "@/modules/user/types/ServiceParams";

export const findAddresses = async ({ userId }: FindAddressesParams) => {
  const addresses = await userRepositories.findAddressesByUserId({ userId });
  return { addresses };
};
