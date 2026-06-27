import type { CreateOrderRequest } from "@repo/types/contracts";

export type CreateOrderParams = {
  userId: string;
} & CreateOrderRequest;

export type ConfirmPaymentParams = {
  orderId: string;
};
