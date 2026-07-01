type VariantOption = {
  productOptionValue: {
    value: string;
    productOption: { name: string };
  };
};

export const formatVariantLabel = (options: VariantOption[]): string => {
  return options
    .map((o) => `${o.productOptionValue.productOption.name}: ${o.productOptionValue.value}`)
    .join(", ");
};
