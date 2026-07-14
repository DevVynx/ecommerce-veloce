import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;

  return (
    <div className="container mx-auto px-4 py-8 lg:px-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-sm">
            <Link href="/admin/orders" className="hover:text-foreground transition-colors">
              Pedidos
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">#{orderNumber}</span>
          </p>
          <h1 className="text-3xl font-bold">Pedido #{orderNumber}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/orders">Voltar</Link>
        </Button>
      </div>

      <div className="text-muted-foreground py-16 text-center">
        <p className="text-lg">Detalhes do pedido em breve</p>
      </div>
    </div>
  );
}
