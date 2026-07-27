import { formatOrderNumber } from "@repo/helpers/formatters";

type OrderStatusEmailData = {
  userName: string;
  orderNumber: number;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  PAID: "pago",
  SHIPPED: "enviado",
  DELIVERED: "entregue",
};

const STATUS_MESSAGES: Record<string, string> = {
  PAID: "Seu pagamento foi confirmado e estamos preparando tudo com muito carinho.",
  SHIPPED: "Seu pedido saiu para entrega e está a caminho do seu endereço.",
  DELIVERED: "Seu pedido foi entregue com sucesso! Esperamos que aproveite cada item.",
};

export function orderStatusEmailHtml(data: OrderStatusEmailData): string {
  const label = STATUS_LABELS[data.status] ?? data.status;
  const message = STATUS_MESSAGES[data.status] ?? "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden">
          <tr>
            <td style="padding:40px 32px 24px;text-align:center;background-color:#6b21a8">
              <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700">Veloce</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px">
              <h2 style="margin:0 0 8px;font-size:20px;color:#18181b;font-weight:600">Boas notícias, ${data.userName}!</h2>
              <p style="margin:0 0 16px;font-size:16px;color:#52525b;line-height:1.5">
                Seu pedido <strong>${formatOrderNumber(data.orderNumber)}</strong> acabou de ser <strong>${label}</strong>.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#71717a;line-height:1.5">${message}</p>
              <p style="margin:0;font-size:14px;color:#a1a1aa">
                Obrigado por comprar na Veloce!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
