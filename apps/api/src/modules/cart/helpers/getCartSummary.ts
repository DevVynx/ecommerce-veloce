import { Prisma } from "../../../../prisma/generated/client/client";

export interface CartItemSummaryInput {
  quantity: number;
  product: {
    variant: {
      price: Prisma.Decimal;
      offer: { salePrice: Prisma.Decimal };
    };
  };
}

export type CartSummary = {
  count: number;
  subtotal: Prisma.Decimal;
  total: Prisma.Decimal;
  discount: Prisma.Decimal;
};

export function getCartSummary(items: CartItemSummaryInput[]): CartSummary {
  const zero = new Prisma.Decimal(0);

  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    return acc.plus(item.product.variant.price.times(item.quantity));
  }, zero);

  const total = items.reduce((acc, item) => {
    return acc.plus(item.product.variant.offer.salePrice.times(item.quantity));
  }, zero);

  const discount = subtotal.minus(total);

  return {
    count,
    subtotal,
    total,
    discount,
  };
}
