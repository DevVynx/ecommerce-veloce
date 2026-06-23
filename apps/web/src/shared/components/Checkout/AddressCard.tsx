import type { AddressDto } from "@repo/types/contracts";
import { MapPin } from "lucide-react";

import { Badge } from "@/shared/components/shadcn-ui/badge";
import { cn } from "@/shared/utils/lib/utils";

type AddressCardProps = {
  address: AddressDto;
  selected: boolean;
  onSelect: (addressId: string) => void;
};

export const AddressCard = ({ address, selected, onSelect }: AddressCardProps) => {
  return (
    <label
      className={cn(
        "border-border hover:ring-primary flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:ring-1",
        selected && "ring-primary ring-1"
      )}
    >
      <input
        type="radio"
        name="selectedAddress"
        checked={selected}
        onChange={() => onSelect(address.id)}
        className="mt-1"
      />

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground size-4" />
          <span className="font-semibold">{address.receiverName}</span>
          {address.label && <span className="text-muted-foreground">({address.label})</span>}
          {address.isDefault && <Badge variant="outline">Padrão</Badge>}
        </div>

        <span>
          {address.street}, {address.number}
          {address.complement && <> — {address.complement}</>}
        </span>

        <span className="text-muted-foreground">
          {address.neighborhood} — {address.city}/{address.state}
        </span>

        <span className="text-muted-foreground">CEP: {address.cep}</span>
      </div>
    </label>
  );
};
