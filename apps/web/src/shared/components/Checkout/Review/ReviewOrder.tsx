import type { AddressDto, ShippingOptionDto } from "@repo/types/contracts";
import type { CreateOrderRequest } from "@repo/types/contracts";
import { Banknote, CreditCard, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createOrder } from "@/shared/actions/orders/createOrder";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import type { PaymentMethod } from "@/shared/states/checkout";
import { formatPrice } from "@/shared/utils/store/price";

import { showNotification } from "../../showNotification";
import { MobileSummary } from "./MobileSummary";

type ReviewOrderProps = {
  address: AddressDto;
  shipping: ShippingOptionDto;
  paymentMethod: PaymentMethod;
  onEditAddress: () => void;
  onEditShipping: () => void;
  onEditPayment: () => void;
};

const PAYMENT_CONFIG: Record<PaymentMethod, { label: string; Icon: typeof CreditCard }> = {
  card: { label: "Cartão de Crédito", Icon: CreditCard },
  pix: { label: "Pix", Icon: Banknote },
};

const SectionCard = ({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border p-4">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-sm font-semibold tracking-wide uppercase">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        className="flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <Pencil className="size-3.5" />
        Editar
      </button>
    </div>
    {children}
  </div>
);

export const ReviewOrder = ({
  address,
  shipping,
  paymentMethod,
  onEditAddress,
  onEditShipping,
  onEditPayment,
}: ReviewOrderProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { label, Icon } = PAYMENT_CONFIG[paymentMethod];

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const isLocalAddress = address.id === "local";

    const input: CreateOrderRequest = {
      ...(!isLocalAddress && { addressId: address.id }),
      ...(isLocalAddress && {
        shippingAddress: {
          receiverName: address.receiverName,
          cep: address.cep.replace(/\D/g, ""),
          street: address.street,
          number: address.number,
          complement: address.complement ?? undefined,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        },
      }),
      shippingService: shipping.service,
      paymentMethod,
    };

    const { data, error } = await createOrder(input);
    setIsSubmitting(false);

    if (error || !data) {
      showNotification({
        type: "error",
        title: "Erro ao criar pedido.",
        message: error?.message as string,
      });
      return;
    }

    router.push(data.paymentUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <MobileSummary shippingPrice={shipping.price} />

      <SectionCard title="Endereço de entrega" onEdit={onEditAddress}>
        <p className="text-muted-foreground text-sm">{address.receiverName}</p>
        <p className="text-muted-foreground text-sm">
          {address.street}, {address.number}
          {address.complement ? ` - ${address.complement}` : ""}
        </p>
        <p className="text-muted-foreground text-sm">
          {address.neighborhood} - {address.city}/{address.state}
        </p>
        <p className="text-muted-foreground text-sm">{address.cep}</p>
      </SectionCard>

      <SectionCard title="Frete" onEdit={onEditShipping}>
        <p className="text-muted-foreground text-sm">{shipping.service}</p>
        <p className="text-muted-foreground text-sm">
          {shipping.deadline.min === shipping.deadline.max
            ? `Entrega em até ${shipping.deadline.min} dia(s) útil(eis)`
            : `Entrega em ${shipping.deadline.min} a ${shipping.deadline.max} dias úteis`}
        </p>
        <p className="text-muted-foreground text-sm">
          {shipping.price === 0 ? "Grátis" : formatPrice(shipping.price)}
        </p>
      </SectionCard>

      <SectionCard title="Pagamento" onEdit={onEditPayment}>
        <div className="flex items-center gap-2">
          <Icon className="text-muted-foreground size-5" />
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </SectionCard>

      <Button
        type="button"
        disabled={isSubmitting}
        className="mt-2 w-full cursor-pointer py-3"
        onClick={handleSubmit}
      >
        {isSubmitting ? <Spinner className="size-4" /> : null}
        Finalizar Compra
      </Button>
    </div>
  );
};
