import { OrderDetailContent } from "./OrderDetailContent";

type OrderExpandedRowProps = {
  orderId: string;
  isExpanded: boolean;
};

export const OrderExpandedRow = ({ orderId, isExpanded }: OrderExpandedRowProps) => {
  if (!isExpanded) return null;

  return (
    <tr className="bg-muted/20 border-b">
      <td colSpan={5} className="pt-2 pb-4">
        <OrderDetailContent orderId={orderId} />
      </td>
    </tr>
  );
};
