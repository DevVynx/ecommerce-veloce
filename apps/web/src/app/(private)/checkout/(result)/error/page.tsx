import { X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";

export default function CheckoutErrorPage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
      <div className="mb-6 rounded-full bg-red-500 p-4">
        <X className="size-10 text-white" />
      </div>

      <h1 className="mb-4 text-3xl font-bold">Pagamento não concluído</h1>

      <p className="text-muted-foreground mb-8 max-w-md text-base">
        O pagamento não foi concluído. Seu carrinho foi mantido e você pode tentar novamente quando
        quiser.
      </p>

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1 cursor-pointer" asChild>
          <Link href="/cart">Ir para o carrinho</Link>
        </Button>
        <Button className="flex-1 cursor-pointer" asChild>
          <Link href="/checkout">Tentar novamente</Link>
        </Button>
      </div>
    </div>
  );
}
