import type { AddressDto } from "@repo/types/contracts";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { listAddresses } from "@/shared/actions/user/listAddresses";
import { AddressCard } from "@/shared/components/Checkout/Address/AddressCard";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";

type AddressListProps = {
  selectedAddressId: string | null;
  onSelect: (addressId: string, address: AddressDto) => void;
  onNewAddress: () => void;
  onEmpty?: () => void;
  onContinue?: () => void;
};

export const AddressList = ({
  selectedAddressId,
  onSelect,
  onNewAddress,
  onEmpty,
  onContinue,
}: AddressListProps) => {
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmptyCalled, setIsEmptyCalled] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      const { data, error } = await listAddresses();

      if (error) {
        setError(typeof error.message === "string" ? error.message : "Erro ao carregar endereços.");
        setIsLoading(false);
        return;
      }

      if (data) {
        if (data.addresses.length === 0 && onEmpty && !isEmptyCalled) {
          setIsEmptyCalled(true);
          onEmpty();
          setIsLoading(false);
          return;
        }

        setAddresses(data.addresses);

        const defaultAddr = data.addresses.find((a) => a.isDefault) ?? data.addresses[0];
        if (defaultAddr && !selectedAddressId) {
          onSelect(defaultAddr.id, defaultAddr);
        }
      }

      setIsLoading(false);
    };

    fetchAddresses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border-border flex items-start gap-3 rounded-lg border p-4">
            <Skeleton className="mt-1 size-4 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="flex max-h-[calc(100dvh-14.5rem)] flex-col gap-3 overflow-hidden">
      {addresses.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum endereço salvo.</p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 py-1">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={selectedAddressId === address.id}
              onSelect={(id) => {
                const addr = addresses.find((a) => a.id === id);
                if (addr) onSelect(id, addr);
              }}
            />
          ))}
        </div>
      )}

      <Button variant="outline" className="w-full shrink-0 cursor-pointer" onClick={onNewAddress}>
        <Plus className="mr-2 size-4" />
        Novo endereço
      </Button>

      <div className="flex flex-col-reverse justify-between gap-5 pt-2 sm:flex-row">
        <Button
          variant="outline"
          className="border-primary/30 w-full cursor-pointer px-6 py-3 sm:w-auto"
          asChild
        >
          <Link href="/cart">
            <ArrowLeft className="size-4" />
            Voltar ao carrinho
          </Link>
        </Button>

        <Button className="w-full cursor-pointer py-3 sm:w-60" onClick={onContinue}>
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
