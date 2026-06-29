import { CheckoutHeader } from "@/shared/components/Checkout/CheckoutHeader";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CheckoutHeader />
      {children}
    </>
  );
}
