import { createOrder } from "./createOrder";
import { findOrderById } from "./findOrderById";
import { findOrderByProduct } from "./findOrderByProduct";
import { findOrdersByUserId } from "./findOrdersByUserId";
import { updateOrderStatus } from "./updateOrderStatus";

export const orderRepositories = {
  createOrder,
  findOrderById,
  findOrderByProduct,
  findOrdersByUserId,
  updateOrderStatus,
};
