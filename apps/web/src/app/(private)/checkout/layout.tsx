import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | BeliBeli Store",
  description: "Finalize seu pedido na BeliBeli Store.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
