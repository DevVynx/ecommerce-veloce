import { db } from "@/shared/lib/db";

type SetDefaultAddressProps = {
  userId: string;
  addressId: string;
};

export const setDefaultAddress = async ({ userId, addressId }: SetDefaultAddressProps) => {
  return db.$transaction(async () => {
    await db.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return db.address.update({ where: { id: addressId }, data: { isDefault: true } });
  });
};
