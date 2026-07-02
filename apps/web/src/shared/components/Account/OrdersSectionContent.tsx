"use client";
import type { OrderDto } from "@repo/types/contracts";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader,
  Package,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { Fragment, useState } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table";

import { OrderDetailContent } from "./OrderDetailContent";
import { OrderExpandedRow } from "./OrderExpandedRow";

type OrdersSectionContentProps = {
  orders: OrderDto[];
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  PENDING: {
    label: "Pendente",
    icon: <Clock className="size-3.5" />,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  PAID: {
    label: "Pago",
    icon: <CheckCircle2 className="size-3.5" />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  PROCESSING: {
    label: "Processando",
    icon: <Loader className="size-3.5 animate-spin" />,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  SHIPPED: {
    label: "Enviado",
    icon: <Truck className="size-3.5" />,
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  DELIVERED: {
    label: "Entregue",
    icon: <CheckCircle2 className="size-3.5" />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELED: {
    label: "Cancelado",
    icon: <XCircle className="size-3.5" />,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  REFUNDED: {
    label: "Reembolsado",
    icon: <RotateCcw className="size-3.5" />,
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
};

export const OrdersSectionContent = ({ orders }: OrdersSectionContentProps) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Meus Pedidos</h2>
        <div className="flex flex-col items-center gap-3 py-12">
          <Package className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm">Nenhum pedido encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Meus Pedidos</h2>
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleOrder(order.id)}
                >
                  <TableCell className="font-mono text-xs">
                    BEL-{String(order.orderNumber).padStart(6, "0")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CONFIG[order.status]?.className ?? "border-muted bg-muted text-muted-foreground"}`}
                    >
                      {STATUS_CONFIG[order.status]?.icon}
                      {STATUS_CONFIG[order.status]?.label ?? order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOrder(order.id);
                      }}
                    >
                      <ChevronDown
                        className={`size-4 transition-transform ${expandedOrderId === order.id ? "rotate-180" : ""}`}
                      />
                      <span className="text-xs">Detalhes</span>
                    </Button>
                  </TableCell>
                </TableRow>

                <OrderExpandedRow
                  key={`expanded-${order.id}`}
                  orderId={order.id}
                  isExpanded={expandedOrderId === order.id}
                />
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col gap-3 lg:hidden">
        {orders.map((order) => (
          <Fragment key={order.id}>
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-mono text-xs font-medium">
                    BEL-{String(order.orderNumber).padStart(6, "0")}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="pt-1 font-semibold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.total)}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CONFIG[order.status]?.className ?? "border-muted bg-muted text-muted-foreground"}`}
                >
                  {STATUS_CONFIG[order.status]?.icon}
                  {STATUS_CONFIG[order.status]?.label ?? order.status}
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => toggleOrder(order.id)}
                >
                  <span className="text-xs">Detalhes</span>
                  <ChevronDown
                    className={`size-4 transition-transform ${expandedOrderId === order.id ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {expandedOrderId === order.id && (
              <div className="-mt-2 rounded-lg border bg-muted/20 p-4">
                <OrderDetailContent orderId={order.id} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
