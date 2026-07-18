"use client";

import type { AdminListCustomersResponse } from "@repo/types/contracts";
import { ExternalLinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CopyIcon } from "@/shared/assets/animatedIcons/copy";
import { Pagination } from "@/shared/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table";
import { showNotification } from "@/shared/components/showNotification";
import { useAnimatedIcons } from "@/shared/hooks/ui/useAnimatedIcons";
import { formatPrice } from "@/shared/utils/store/price";

function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const { getHandlers, getIconRef } = useAnimatedIcons({});

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      showNotification({
        type: "success",
        title: "ID copiado!",
        message: "O ID do cliente foi copiado para a área de transferência.",
      });
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      {...getHandlers(`copy-${id}`)}
      onClick={handleCopy}
      className="text-muted-foreground hover:text-foreground mt-0.5 inline-flex cursor-pointer items-center gap-1 font-mono text-xs transition-colors"
    >
      {copied ? "Copiado!" : `${id.slice(0, 8)}...${id.slice(-4)}`}
      <CopyIcon ref={getIconRef(`copy-${id}`)} size={12} />
    </button>
  );
}

type CustomerTableProps = {
  data: AdminListCustomersResponse;
  page: number;
  onPageChange: (page: number) => void;
};

export function CustomerTable({ data, page, onPageChange }: CustomerTableProps) {
  const router = useRouter();
  const totalPages = data.pagination.totalPages;

  if (data.customers.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        <p className="text-lg">Nenhum cliente encontrado</p>
        <p className="mt-1 text-sm">Tente ajustar os filtros ou a busca.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground mb-3 text-sm">
        Mostrando {data.customers.length} itens de {data.pagination.total}
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-24 text-right">Pedidos</TableHead>
              <TableHead className="w-32 text-right">Total Gasto</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push(`/admin/customers/${customer.id}`)}
              >
                <TableCell>
                  <p className="text-sm font-medium">{customer.name}</p>
                  <CopyableId id={customer.id} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{customer.email}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {customer.orderCount}
                </TableCell>
                <TableCell className="text-right text-sm font-medium tabular-nums">
                  {formatPrice(customer.totalSpent)}
                </TableCell>
                <TableCell className="w-10">
                  <ExternalLinkIcon className="text-muted-foreground size-4" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
