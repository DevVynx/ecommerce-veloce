import { Minus, Plus } from "lucide-react";

import { Button } from "@/shared/components/shadcn-ui/button";

type CartItemQuantityProps = {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export const CartItemQuantity = ({
  value,
  min = 1,
  max = 99,
  disabled = false,
  onChange,
}: CartItemQuantityProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(value - 1)}
        disabled={value <= min || disabled}
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-3" />
      </Button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(value + 1)}
        disabled={value >= max || disabled}
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-3" />
      </Button>
    </div>
  );
};
