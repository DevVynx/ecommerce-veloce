import type { ProductOptionDto } from "@repo/types/contracts";

export const buildSelectedOptionsForCart = (
  options: ProductOptionDto[],
  selectedOptions: Record<string, string>
): Array<{ name: string; value: string }> => {
  return Object.entries(selectedOptions).map(([optionId, valueId]) => {
    const option = options.find((opt) => opt.id === optionId);
    const value = option?.values.find((val) => val.id === valueId);
    return {
      name: option?.name ?? "Unknown",
      value: value?.value ?? "Unknown",
    };
  });
};
