import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type UpdateProps = {
  addressId: string;
  data: Prisma.AddressUpdateInput;
};

export const update = async ({ addressId, data }: UpdateProps) => {
  const address = await db.address.update({ where: { id: addressId }, data });
  return address;
};
