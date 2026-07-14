export type CreateOrderRequest = {
  addressId?: string;
  shippingAddress?: {
    receiverName: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  shippingService: string;
  paymentMethod: "card" | "pix";
  couponCode?: string;
};

export type AdminActiveOrdersRequest = {
  range: "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
};

export type AdminGetOrdersRequest = {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  q?: string;
  status?: string;
};
