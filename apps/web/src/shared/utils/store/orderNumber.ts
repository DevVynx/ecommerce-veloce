export function formatOrderNumber(orderNumber: number): string {
  return `BEL-${String(orderNumber).padStart(6, "0")}`;
}
