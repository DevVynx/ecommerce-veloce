import { CheckoutResultHeader } from "@/shared/components/Checkout/CheckoutResultHeader";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CheckoutResultHeader />
      {children}
    </>
  );
}
