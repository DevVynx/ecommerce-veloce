import { db } from "@/shared/lib/db";

type FindByAddressIdProps = {
  addressId: string;
};

export const findByAddressId = async ({ addressId }: FindByAddressIdProps) => {
  const address = await db.address.findUnique({ where: { id: addressId } });
  return address;
};
