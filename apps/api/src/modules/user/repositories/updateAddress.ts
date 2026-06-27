import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type UpdateAddressProps = {
  addressId: string;
  data: Prisma.AddressUpdateInput;
};

export const updateAddress = async ({ addressId, data }: UpdateAddressProps) => {
  const address = await db.address.update({ where: { id: addressId }, data });
  return address;
};
