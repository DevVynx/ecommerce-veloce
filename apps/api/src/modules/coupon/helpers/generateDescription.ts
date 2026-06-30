export function generateDescription(
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING",
  value: number,
  maxDiscount?: number | null
): string {
  if (type === "PERCENTAGE") {
    const base = `${value}% OFF`;
    return maxDiscount ? `${base} (máx. R$ ${maxDiscount})` : base;
  }

  if (type === "FIXED") {
    return `R$ ${value} de desconto`;
  }

  return "Frete grátis";
}
