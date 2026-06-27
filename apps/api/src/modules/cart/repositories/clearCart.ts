import { db } from "@/shared/lib/db";

type ClearCartProps = {
  cartId: string;
};

export const clearCart = async ({ cartId }: ClearCartProps) => {
  await db.cartItem.deleteMany({ where: { cartId } });
};
