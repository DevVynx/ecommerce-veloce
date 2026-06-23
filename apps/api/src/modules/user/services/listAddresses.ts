import { addressRepositories } from "@/modules/user/repositories";
import type { ListAddressesParams } from "@/modules/user/types/ServiceParams";

export const listAddresses = async ({ userId }: ListAddressesParams) => {
  const addresses = await addressRepositories.findManyByUserId({ userId });
  return { addresses };
};
