import type { Metadata } from "next";

import { CheckoutHeader } from "@/shared/components/Checkout/CheckoutHeader";

export const metadata: Metadata = {
  title: "Checkout | BeliBeli Store",
  description: "Finalize seu pedido na BeliBeli Store.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CheckoutHeader />
      {children}
    </>
  );
}
