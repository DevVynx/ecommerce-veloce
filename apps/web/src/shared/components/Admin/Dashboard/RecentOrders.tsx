"use client";

import type { AdminOrderDto } from "@repo/types/contracts";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

import { SectionError } from "@/shared/components/SectionError";
import { useAdminOrders } from "@/shared/hooks/data/adminQueries/useOrder";
import { STATUS_CONFIG } from "@/shared/utils/store/orders/statusConfig";
import { formatPrice } from "@/shared/utils/store/price";
import { formatOrderNumber } from "@/shared/utils/store/orderNumber";

import { RecentOrdersSkeleton } from "./RecentOrdersSkeleton";

export function RecentOrders() {
  const { data, isLoading, isError, error } = useAdminOrders({
    limit: 5,
    page: 1,
    sort: "desc",
  });

  if (isError) {
    return (
      <SectionError
        title="Pedidos indisponíveis"
        description={error ? error.message : "Não foi possível carregar os pedidos recentes."}
      />
    );
  }

  if (isLoading) {
    return <RecentOrdersSkeleton />;
  }

  if (!data || data.orders.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            Ver todos os pedidos
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 py-12">
          <Package className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm">Nenhum pedido encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          Ver todos os pedidos
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left text-xs tracking-wider uppercase">
              <th className="pr-4 pb-3 font-medium">Pedido</th>
              <th className="pr-4 pb-3 font-medium">Cliente</th>
              <th className="pr-4 pb-3 font-medium">Total</th>
              <th className="pr-4 pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((item: AdminOrderDto) => {
              const config = STATUS_CONFIG[item.order.status];
              return (
                <tr key={item.order.id} className="border-b last:border-b-0">
                  <td className="py-3 pr-4 font-mono text-xs">
                    {formatOrderNumber(item.order.orderNumber)}
                  </td>
                  <td className="py-3 pr-4 text-sm">{item.order.user.name}</td>
                  <td className="py-3 pr-4 text-sm font-medium tabular-nums">
                    {formatPrice(item.order.total)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config?.className ?? "border-muted bg-muted text-muted-foreground"}`}
                    >
                      {config?.icon}
                      {config?.label ?? item.order.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
