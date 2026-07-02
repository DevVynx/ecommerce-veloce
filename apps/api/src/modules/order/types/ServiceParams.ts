import type { CreateOrderRequest } from "@repo/types/contracts";

export type CreateOrderParams = {
  userId: string;
} & CreateOrderRequest;

export type ConfirmPaymentParams = {
  orderId: string;
};

export type CancelOrderParams = {
  orderId: string;
};

export type FindOrderByIdParams = {
  orderId: string;
  userId: string;
};
