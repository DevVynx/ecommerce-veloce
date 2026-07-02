"use client";
import type { AddressDto } from "@repo/types/contracts";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/shadcn-ui/button";

type AddressCardProps = {
  address: AddressDto;
  onEdit: (address: AddressDto) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
};

export const AddressCard = ({
  address: addr,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) => {
  return (
    <div className="flex items-start justify-between rounded-lg border px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{addr.receiverName}</p>
          {addr.label && (
            <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
              {addr.label}
            </span>
          )}
          {addr.isDefault && (
            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs">Padrão</span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {addr.street}, {addr.number}
          {addr.complement ? ` - ${addr.complement}` : ""}
        </p>
        <p className="text-muted-foreground text-sm">
          {addr.neighborhood} - {addr.city}/{addr.state} — {addr.cep}
        </p>
        {!addr.isDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(addr.id)}
            className="text-primary mt-2 cursor-pointer text-xs font-medium hover:underline"
          >
            Definir como padrão
          </button>
        ) : (
          <div className="mt-2 h-4" />
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer"
          onClick={() => onEdit(addr)}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer text-red-500 hover:text-red-600"
          onClick={() => onDelete(addr.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
