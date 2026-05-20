import Decimal from "decimal.js";

export const asDecimal = (value: number | Decimal): Decimal =>
  value instanceof Decimal ? value : new Decimal(value);

export const formatPrice = (value: number | Decimal): string => {
  const decimal = asDecimal(value);
  return `R$ ${decimal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2)}`;
};

export const formatDiscount = (value: number | Decimal): string => {
  const decimal = asDecimal(value);
  return `-R$ ${decimal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2)}`;
};

export const calculateDiscountPercent = (price: number, salePrice: number): number => {
  const base = asDecimal(price);
  const sale = asDecimal(salePrice);
  const discount = base.minus(sale).div(base).times(100);
  return discount.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
};
