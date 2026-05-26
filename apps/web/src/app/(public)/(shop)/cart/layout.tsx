import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrinho | BeliBeli Store",
  description:
    "Revise os itens do seu carrinho na BeliBeli Store e finalize sua compra com segurança e praticidade.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
