import { db } from "@/shared/lib/db";

type DeleteAddressProps = {
  addressId: string;
};

export const deleteAddress = async ({ addressId }: DeleteAddressProps) => {
  await db.address.delete({ where: { id: addressId } });
};
