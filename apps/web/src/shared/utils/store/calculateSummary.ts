import type { CartDto, CartItemDto } from "@repo/types/contracts";
import Decimal from "decimal.js";

import { asDecimal } from "@/shared/utils/store/price";

export const calculateSummary = (items: CartItemDto[]): CartDto["summary"] => {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    return acc.plus(asDecimal(item.product.variant.price).times(item.quantity));
  }, new Decimal(0));

  const total = items.reduce((acc, item) => {
    const effectivePrice = item.product.variant.isOnSale
      ? item.product.variant.salePrice
      : item.product.variant.price;
    return acc.plus(asDecimal(effectivePrice).times(item.quantity));
  }, new Decimal(0));

  const discount = subtotal.minus(total);

  return {
    count,
    subtotal: toSummaryNumber(subtotal),
    total: toSummaryNumber(total),
    discount: toSummaryNumber(discount),
  };
};

const toSummaryNumber = (decimal: Decimal): number =>
  decimal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
