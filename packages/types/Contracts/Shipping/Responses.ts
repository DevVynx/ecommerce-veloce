export type ShippingOptionDto = {
  service: string;
  price: number;
  deadline: {
    min: number;
    max: number;
  };
};

export type QuoteShippingResponse = {
  items: {
    quantity: number;
    weight: number;
  };
  shippingOptions: ShippingOptionDto[];
};
