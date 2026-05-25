import { Minus, Plus } from "lucide-react";

import { cn } from "@/shared/utils/lib/utils";

type QuantitySelectorProps = {
  max?: number;
  min?: number;
  quantity: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export const QuantitySelector = ({
  max = 99,
  min = 1,
  quantity,
  disabled = false,
  onChange,
}: QuantitySelectorProps) => {
  const isAtMin = quantity <= min;
  const isAtMax = quantity >= max;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-zinc-700">Quantidade:</span>
      <div
        className={cn(
          "flex items-center rounded-md border transition-colors",
          disabled ? "border-zinc-200 bg-zinc-50" : "border-zinc-300 bg-white"
        )}
      >
        <button
          onClick={() => onChange(quantity - 1)}
          disabled={isAtMin || disabled}
          className={cn(
            "flex size-9 cursor-pointer items-center justify-center text-lg font-medium text-zinc-600 tabular-nums transition-colors",
            "hover:bg-zinc-100 active:bg-zinc-200",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
          )}
          aria-label="Diminuir quantidade"
        >
          <Minus size={18} />
        </button>

        <span
          className={cn(
            "flex min-w-12 items-center justify-center border-x px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors",
            disabled ? "border-zinc-200 bg-zinc-50 text-zinc-400" : "border-zinc-300 text-zinc-800"
          )}
        >
          {quantity}
        </span>

        <button
          onClick={() => onChange(quantity + 1)}
          disabled={isAtMax || disabled}
          className={cn(
            "flex size-9 cursor-pointer items-center justify-center text-lg font-medium text-zinc-600 tabular-nums transition-colors",
            "hover:bg-zinc-100 active:bg-zinc-200",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
          )}
          aria-label="Aumentar quantidade"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
