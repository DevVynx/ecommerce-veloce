import type { ShippingOptionDto } from "@repo/types/contracts";
import { useEffect, useState } from "react";

import { quoteShipping } from "@/shared/actions/shipping/quoteShipping";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { useCartState } from "@/shared/states/cart";

import { ShippingError } from "./ShippingError";
import { ShippingOptions } from "./ShippingOptions";
import { ShippingUnavailable } from "./ShippingUnavailable";

type ShippingSelectorProps = {
  destinyCep: string;
  selectedShipping: ShippingOptionDto | null;
  onSelect: (option: ShippingOptionDto) => void;
  onPrevious: () => void;
  onContinue: () => void;
};

export const ShippingSelector = ({
  destinyCep,
  selectedShipping,
  onSelect,
  onPrevious,
  onContinue,
}: ShippingSelectorProps) => {
  const [options, setOptions] = useState<ShippingOptionDto[]>([]);
  const [freeShippingMinValue, setFreeShippingMinValue] = useState<number | null>(null);
  const [freeShippingByCoupon, setFreeShippingByCoupon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { appliedCoupon } = useCartState();

  useEffect(() => {
    const fetchShipping = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await quoteShipping(destinyCep);

      if (error) {
        setError(typeof error.message === "string" ? error.message : "Erro ao calcular frete.");
        setIsLoading(false);
        return;
      }

      if (data) {
        const hasFreeShippingCoupon = appliedCoupon?.type === "FREE_SHIPPING";
        const apiAlreadyZeroed = data.shippingOptions.every((o) => o.price === 0);
        const finalOptions =
          hasFreeShippingCoupon && !apiAlreadyZeroed
            ? data.shippingOptions.map((o) => ({ ...o, price: 0 }))
            : data.shippingOptions;

        setOptions(finalOptions);
        setFreeShippingMinValue(data.freeShippingMinValue);
        setFreeShippingByCoupon(hasFreeShippingCoupon && !apiAlreadyZeroed);

        const cheapest = finalOptions.reduce((prev, curr) =>
          curr.price < prev.price ? curr : prev
        );

        if (!cheapest.price) {
          onSelect(cheapest);
        }
      }

      setIsLoading(false);
    };

    fetchShipping();
  }, [destinyCep]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border-border flex items-start gap-3 rounded-lg border p-4">
            <Skeleton className="mt-1 size-4 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <ShippingError message={error} onPrevious={onPrevious} />;
  if (options.length === 0) return <ShippingUnavailable onPrevious={onPrevious} />;

  return (
    <ShippingOptions
      options={options}
      freeShippingMinValue={freeShippingMinValue}
      freeShippingByCoupon={freeShippingByCoupon}
      selectedShipping={selectedShipping}
      onSelect={onSelect}
      onPrevious={onPrevious}
      onContinue={onContinue}
    />
  );
};
