import { cancelOrder } from "./cancelOrder";
import { confirmPayment } from "./confirmPayment";
import { createOrder } from "./createOrder";
import { findOrderById } from "./findById";
import { listOrders } from "./listOrders";
import { validateOrderProduct } from "./validateOrderProduct";

export const orderServices = {
  createOrder,
  confirmPayment,
  cancelOrder,
  findOrderById,
  listOrders,
  validateOrderProduct,
};
