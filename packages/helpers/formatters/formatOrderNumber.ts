export function formatOrderNumber(orderNumber: number): string {
  return `VEL-${String(orderNumber).padStart(6, "0")}`;
}
