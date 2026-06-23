"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createAddress } from "@/shared/actions/user/createAddress";
import { AddressForm } from "@/shared/components/Checkout/AddressForm";
import { AddressList } from "@/shared/components/Checkout/AddressList";
import { CheckoutStepper } from "@/shared/components/Checkout/CheckoutStepper";
import { OrderSummary } from "@/shared/components/Checkout/OrderSummary";
import { showNotification } from "@/shared/components/showNotification";
import type { AddressFormValues } from "@/shared/schemas/checkout/address";
import { useCheckoutState } from "@/shared/states/checkout";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";

const CheckoutPage = () => {
  const router = useRouter();
  const { step, setStep, stepIndex, setSelectedAddress, selectedAddressId } = useCheckoutState();

  const [showForm, setShowForm] = useState(false);
  const [hadAddresses, setHadAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressFormContinue = async (data: AddressFormValues, saveAddress: boolean) => {
    setIsSubmitting(true);

    if (saveAddress) {
      const { data: result, error } = await authenticatedAction(createAddress, {
        receiverName: data.receiverName,
        label: data.label || undefined,
        cep: data.cep.replace(/\D/g, ""),
        street: data.street,
        number: data.number,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      });

      if (error) {
        showNotification({
          type: "error",
          title: "Não foi possível salvar o endereço para as próximas compras",
        });
      } else if (result) {
        setSelectedAddress(result.address.id, result.address);
      }
    }

    setIsSubmitting(false);
    setStep("shipping");
  };

  return (
    <div className="container mx-auto grid gap-20 px-4 py-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <CheckoutStepper currentStep={stepIndex} />

        <h1 className="text-3xl font-bold">
          {step === "address" && "Endereço de entrega"}
          {step === "shipping" && "Frete"}
          {step === "payment" && "Pagamento"}
          {step === "review" && "Revisar pedido"}
        </h1>

        {step === "address" && !showForm && (
          <AddressList
            selectedAddressId={selectedAddressId}
            onSelect={(id, addr) => setSelectedAddress(id, addr)}
            onNewAddress={() => {
              setHadAddresses(true);
              setShowForm(true);
            }}
            onEmpty={() => setShowForm(true)}
          />
        )}

        {step === "address" && showForm && (
          <AddressForm
            onSubmit={handleAddressFormContinue}
            onPrevious={hadAddresses ? () => setShowForm(false) : () => router.push("/cart")}
            isSubmitting={isSubmitting}
            submitLabel="Continuar com este endereço"
          />
        )}
      </div>

      <div className="hidden lg:block">
        <OrderSummary />
      </div>
    </div>
  );
};

export default CheckoutPage;
