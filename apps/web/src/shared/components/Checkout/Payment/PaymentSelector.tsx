import { CreditCard } from "lucide-react";

import { Button } from "@/shared/components/shadcn-ui/button";
import type { PaymentMethod } from "@/shared/states/checkout";

type PaymentSelectorProps = {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  onPrevious: () => void;
  onContinue: () => void;
  isSubmitting?: boolean;
};

const OPTIONS: { value: PaymentMethod; label: string; Icon: typeof CreditCard }[] = [
  { value: "card", label: "Cartão de Crédito", Icon: CreditCard },
  // { value: "pix", label: "Pix", Icon: Banknote },
];

export const PaymentSelector = ({
  selectedMethod,
  onSelect,
  onPrevious,
  onContinue,
  isSubmitting = false,
}: PaymentSelectorProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {OPTIONS.map(({ value, label, Icon }) => {
          const selected = selectedMethod === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? "border-primary" : "border-muted-foreground/30"
                }`}
              >
                {selected && <div className="bg-primary size-2.5 rounded-full" />}
              </div>
              <Icon className="text-muted-foreground size-5" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 flex-col-reverse items-center justify-between gap-5 pt-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="border-primary/30 w-full cursor-pointer px-6 py-3 sm:w-auto"
          onClick={onPrevious}
        >
          Voltar
        </Button>

        <Button
          type="button"
          disabled={!selectedMethod || isSubmitting}
          className="w-full cursor-pointer py-3 sm:w-60"
          onClick={onContinue}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
