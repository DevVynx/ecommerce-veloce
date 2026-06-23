import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type CreateAddressProps = {
  data: Prisma.AddressCreateInput;
};

export const createAddress = async ({ data }: CreateAddressProps) => {
  const address = await db.address.create({ data });

  return address;
};
