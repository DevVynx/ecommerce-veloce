import { db } from "@/shared/lib/db";

type FindAddressByIdProps = {
  addressId: string;
};

export const findAddressById = async ({ addressId }: FindAddressByIdProps) => {
  const address = await db.address.findUnique({ where: { id: addressId } });
  return address;
};
