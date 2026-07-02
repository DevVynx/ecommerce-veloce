export type OrderDto = {
  id: string;
  orderNumber: number;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string;
};

export type OrderItemDto = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  hasReviewed: boolean;
  userReview: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  } | null;
};

export type ShippingAddressDto = {
  receiverName: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
};

export type OrderDetailDto = OrderDto & {
  items: OrderItemDto[];
  shippingAddress: ShippingAddressDto | null;
};

export type CreateOrderResponse = {
  order: OrderDto;
  paymentUrl: string;
};

export type GetOrderByIdResponse = {
  order: OrderDetailDto;
};
