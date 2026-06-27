import { Check, Tag, X } from "lucide-react";
import { useState } from "react";

import { validateCoupon } from "@/shared/actions/coupons/validateCoupon";
import { AuthModal } from "@/shared/components/Auth/AuthModal";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import { showNotification } from "@/shared/components/showNotification";
import { useAuthState } from "@/shared/states/auth";
import { useCartState } from "@/shared/states/cart";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";
import { formatDiscount } from "@/shared/utils/store/price";

type CouponApplierProps = {
  subtotal: number;
};

export const CouponApplier = ({ subtotal: _subtotal }: CouponApplierProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { appliedCoupon, setCoupon, clearCoupon } = useCartState();
  const { isAuthenticated } = useAuthState();

  const handleApply = async () => {
    const code = inputValue.toUpperCase().trim();
    if (!code) return;

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    setIsApplying(true);

    const { data, error } = await authenticatedAction(validateCoupon, { code });

    if (error || !data) {
      setError(error?.message as string);
      showNotification({
        type: "error",
        title: "Cupom inválido",
        message: error?.message as string,
      });
      setIsApplying(false);
      return;
    }

    setError(null);

    showNotification({
      type: "success",
      title: "Cupom aplicado!",
      message: `${data.coupon.code} — ${data.coupon.description}`,
    });

    setCoupon({
      code: data.coupon.code,
      discount: data.discountValue,
      description: data.coupon.description,
    });
    setInputValue("");
    setIsApplying(false);
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
            onClick={clearCoupon}
            aria-label="Remover cupom"
          >
            <X className="size-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onLoginSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
};
