import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
      <div className="bg-green-500 mb-6 rounded-full p-4">
        <Check className="size-10 text-white" />
      </div>

      <h1 className="mb-4 text-3xl font-bold">Muito obrigado pelo seu pedido!</h1>

      <p className="text-muted-foreground mb-8 max-w-md text-base">
        Seu pedido foi confirmado com sucesso e em breve você receberá um e-mail
        com todos os detalhes da compra.
      </p>

      <div className="border-border mb-8 w-full max-w-sm rounded-lg border p-6">
        <p className="text-muted-foreground mb-1 text-sm">Nº do pedido</p>
        <p className="font-mono text-lg font-semibold">
          BEL-{session_id?.slice(0, 8).toUpperCase() ?? Date.now()}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1 cursor-pointer" asChild>
          <Link href="/account">Ver meus pedidos</Link>
        </Button>
        <Button className="flex-1 cursor-pointer" asChild>
          <Link href="/">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  );
}
