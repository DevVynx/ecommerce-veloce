"use client";

import type { AdminListOrdersResponse } from "@repo/types/contracts";
import { CheckCircle2, Clock, PackageCheck, RotateCcw, Truck, Undo2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { ExternalLinkIcon } from "@/shared/assets/animatedIcons/external-link";
import { Pagination } from "@/shared/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table";
import { useAnimatedIcons } from "@/shared/hooks/ui/useAnimatedIcons";
import { formatOrderNumber } from "@/shared/utils/store/orderNumber";
import { formatPrice } from "@/shared/utils/store/price";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  PENDING: {
    label: "Pendente",
    icon: <Clock className="size-3.5" />,
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  PAID: {
    label: "Pago",
    icon: <CheckCircle2 className="size-3.5" />,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  PROCESSING: {
    label: "Processando",
    icon: <RotateCcw className="size-3.5" />,
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
  SHIPPED: {
    label: "Enviado",
    icon: <Truck className="size-3.5" />,
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  DELIVERED: {
    label: "Entregue",
    icon: <PackageCheck className="size-3.5" />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELED: {
    label: "Cancelado",
    icon: <XCircle className="size-3.5" />,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  REFUNDED: {
    label: "Reembolsado",
    icon: <Undo2 className="size-3.5" />,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    icon: null,
    className: "border-muted bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR");
}

type OrderTableProps = {
  data: AdminListOrdersResponse;
  page: number;
  onPageChange: (page: number) => void;
};

export function OrderTable({ data, page, onPageChange }: OrderTableProps) {
  const router = useRouter();
  const { getHandlers, getIconRef } = useAnimatedIcons();
  const totalPages = data.pagination.totalPages;

  if (data.orders.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        <p className="text-lg">Nenhum pedido encontrado</p>
        <p className="mt-1 text-sm">Tente ajustar os filtros ou a busca.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground mb-3 text-sm">
        Mostrando {data.orders.length} itens de {data.pagination.total}
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.orders.map((item) => {
              const order = item.order;
              return (
                <TableRow
                  key={order.id}
                  {...getHandlers(order.id)}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.orderNumber}`)}
                >
                  <TableCell className="w-12">
                    <ExternalLinkIcon ref={getIconRef(order.id)} size={16} />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">
                      {formatOrderNumber(order.orderNumber)}
                    </span>
                    <p className="text-muted-foreground text-xs">{formatDate(order.createdAt)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{order.user.name}</p>
                    <p className="text-muted-foreground text-xs">{order.user.email}</p>
                  </TableCell>
                  <TableCell className="text-sm font-medium tabular-nums">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
