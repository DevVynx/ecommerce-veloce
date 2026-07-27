import { formatOrderNumber } from "@repo/helpers/formatters";
import { resend } from "@/infra/mail";
import { orderStatusEmailHtml } from "@/infra/mail/templates/orderStatusEmail";
import { db } from "@/shared/lib/db";

import type { OrderStatus } from "../../../../prisma/generated/client/enums";

export async function sendOrderStatusEmail(orderId: string, status: OrderStatus): Promise<void> {
  if (!["PAID", "SHIPPED", "DELIVERED"].includes(status)) return;

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) return;

  const labelMap: Record<string, string> = {
    PAID: "confirmado",
    SHIPPED: "enviado",
    DELIVERED: "entregue",
  };

  const label = labelMap[status] ?? status;

  await resend.emails.send({
    from: "Veloce <onboarding@resend.dev>",
    to: order.user.email,
    subject: `Seu pedido ${formatOrderNumber(order.orderNumber)} foi ${label}!`,
    html: orderStatusEmailHtml({
      userName: order.user.name,
      orderNumber: order.orderNumber,
      status,
    }),
  });
}
