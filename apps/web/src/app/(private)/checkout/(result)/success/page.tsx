import { Check } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";

import { OrderNumber } from "./order-number";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
      <div className="mb-6 rounded-full bg-green-500 p-4">
        <Check className="size-10 text-white" />
      </div>

      <h1 className="mb-4 text-3xl font-bold">Muito obrigado pelo seu pedido!</h1>

      <p className="text-muted-foreground mb-8 max-w-md text-base">
        Seu pedido foi confirmado com sucesso e em breve você receberá um e-mail com todos os
        detalhes da compra.
      </p>

      <div className="border-border mb-8 w-full max-w-sm rounded-lg border p-6">
        <p className="text-muted-foreground mb-1 text-sm">Nº do pedido</p>
        <p className="font-mono text-lg font-semibold">
          <Suspense fallback={<span>---</span>}>
            <OrderNumber />
          </Suspense>
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1 cursor-pointer" asChild>
          <Link href="/account?tab=orders">Ver meus pedidos</Link>
        </Button>
        <Button className="flex-1 cursor-pointer" asChild>
          <Link href="/">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  );
}
