import type { ShippingOptionDto } from "@repo/types/contracts";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";

import { Button } from "@/shared/components/shadcn-ui/button";
import { cn } from "@/shared/utils/lib/utils";
import { formatPrice } from "@/shared/utils/store/price";

type ShippingOptionsProps = {
  options: ShippingOptionDto[];
  freeShippingMinValue: number | null;
  freeShippingByCoupon?: boolean;
  selectedShipping: ShippingOptionDto | null;
  onSelect: (option: ShippingOptionDto) => void;
  onPrevious: () => void;
  onContinue: () => void;
};

export const ShippingOptions = ({
  options,
  freeShippingMinValue,
  freeShippingByCoupon,
  selectedShipping,
  onSelect,
  onPrevious,
  onContinue,
}: ShippingOptionsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {freeShippingMinValue !== null && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {options.every((o) => o.price === 0) ? (
            freeShippingByCoupon
              ? "Você possui um cupom de frete grátis!"
              : "Você atingiu o valor mínimo para frete grátis!"
          ) : (
            `Frete grátis a partir de ${formatPrice(freeShippingMinValue)}`
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option.service}
            className={cn(
              "border-border hover:ring-primary flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition hover:ring-1",
              selectedShipping?.service === option.service && "ring-primary ring-1"
            )}
          >
            <input
              type="radio"
              name="shipping"
              checked={selectedShipping?.service === option.service}
              onChange={() => onSelect(option)}
              className="mt-0.5 shrink-0"
            />

            <Package className="text-muted-foreground size-5 shrink-0" />

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-semibold">{option.service}</span>
              <span className="text-muted-foreground text-sm">
                {option.deadline.min} a {option.deadline.max} dias úteis
              </span>
            </div>

            <span className="shrink-0 font-semibold">
              {option.price === 0 ? (
                <span className="text-green-600">Grátis</span>
              ) : (
                formatPrice(option.price)
              )}
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-1 flex-col-reverse items-center justify-between gap-5 pt-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="border-primary/30 w-full cursor-pointer px-6 py-3 sm:w-auto"
          onClick={onPrevious}
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>

        <Button
          className="w-full cursor-pointer py-3 sm:w-60"
          disabled={!selectedShipping}
          onClick={onContinue}
        >
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
