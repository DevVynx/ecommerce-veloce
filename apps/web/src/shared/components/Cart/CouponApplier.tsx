import Decimal from "decimal.js";
import { Check, Tag, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import { asDecimal, formatDiscount } from "@/shared/utils/store/price";

type MockCoupon = {
  type: "percentage" | "fixed";
  value: number;
  description: string;
};

const MOCK_COUPONS: Record<string, MockCoupon> = {
  BEMVINDO: { type: "fixed", value: 15, description: "R$ 15 de desconto" },
  FRETE10: { type: "percentage", value: 10, description: "10% de desconto" },
  VIP30: { type: "percentage", value: 30, description: "30% de desconto" },
};

export type AppliedCoupon = {
  code: string;
  discount: number;
  description: string;
};

type CouponApplierProps = {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onClear: () => void;
};

export const CouponApplier = ({
  subtotal,
  appliedCoupon,
  onApply,
  onClear,
}: CouponApplierProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    const code = inputValue.toUpperCase().trim();
    if (!code) return;

    const coupon = MOCK_COUPONS[code];
    if (!coupon) {
      setError("Cupom inválido");
      return;
    }

    setIsApplying(true);
    setError(null);

    setTimeout(() => {
      const subtotalDecimal = asDecimal(subtotal);
      const discount =
        coupon.type === "percentage"
          ? subtotalDecimal.times(coupon.value).div(100)
          : Decimal.min(subtotalDecimal, coupon.value);
      const discountRounded = discount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

      onApply({ code, discount: discountRounded.toNumber(), description: coupon.description });
      setInputValue("");
      setIsApplying(false);
    }, 1000);
  };

  if (appliedCoupon) {
    return (
      <div className="bg-muted flex items-center justify-between rounded-md px-3 py-2">
        <div className="flex items-center gap-2">
          <Check className="size-4 text-green-600" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase">{appliedCoupon.code}</span>
            <span className="text-muted-foreground text-xs">{appliedCoupon.description}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-red-500">
            {formatDiscount(appliedCoupon.discount)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer"
            onClick={onClear}
            aria-label="Remover cupom"
          >
            <X className="size-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Cupom de desconto"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value.toUpperCase());
              setError(null);
            }}
            className="h-9 pl-8 text-sm"
            maxLength={15}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0 cursor-pointer font-semibold"
          onClick={handleApply}
          disabled={!inputValue.trim() || isApplying}
        >
          {isApplying ? <Spinner className="size-4" /> : "Aplicar"}
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
