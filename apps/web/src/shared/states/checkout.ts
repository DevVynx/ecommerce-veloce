import type { AddressDto, ShippingOptionDto } from "@repo/types/contracts";
import { create } from "zustand";

export type CheckoutStep = "address" | "shipping" | "payment" | "review";

type CheckoutState = {
  step: CheckoutStep;
  stepIndex: number;
  selectedAddressId: string | null;
  selectedAddress: AddressDto | null;
  selectedShipping: ShippingOptionDto | null;
  shippingOptions: ShippingOptionDto[];

  setStep: (step: CheckoutStep) => void;
  setSelectedAddress: (addressId: string, address: AddressDto) => void;
  setSelectedShipping: (shipping: ShippingOptionDto) => void;
  setShippingOptions: (options: ShippingOptionDto[]) => void;
  clearSelectedShipping: () => void;
  reset: () => void;
};

const STEP_ORDER: CheckoutStep[] = ["address", "shipping", "payment", "review"];

export const useCheckoutState = create<CheckoutState>()((set) => ({
  step: "address",
  stepIndex: 0,
  selectedAddressId: null,
  selectedAddress: null,
  selectedShipping: null,
  shippingOptions: [],

  setStep: (step) => set({ step, stepIndex: STEP_ORDER.indexOf(step) }),

  setSelectedAddress: (addressId, address) =>
    set({ selectedAddressId: addressId, selectedAddress: address }),

  setSelectedShipping: (shipping) => set({ selectedShipping: shipping }),

  setShippingOptions: (options) => set({ shippingOptions: options }),

  clearSelectedShipping: () => set({ selectedShipping: null }),

  reset: () =>
    set({
      step: "address",
      stepIndex: 0,
      selectedAddressId: null,
      selectedAddress: null,
      selectedShipping: null,
      shippingOptions: [],
    }),
}));
