"use client";
import { CartEmpty } from "@/shared/components/Cart/CartEmpty";
import { CartItemCard } from "@/shared/components/Cart/CartItemCard";
import { CartItemSkeleton } from "@/shared/components/Cart/CartItemSkeleton";
import { CartMobileSummaryDrawer } from "@/shared/components/Cart/CartMobileSummaryDrawer";
import { CartShippingCalculator } from "@/shared/components/Cart/CartShippingCalculator";
import { CartShippingSkeleton } from "@/shared/components/Cart/CartShippingSkeleton";
import { CartSuggestions } from "@/shared/components/Cart/CartSuggestions";
import { CartSummary } from "@/shared/components/Cart/CartSummary";
import { CartSummarySkeleton } from "@/shared/components/Cart/CartSummarySkeleton";
import { useCartState } from "@/shared/states/cart";

const CartPage = () => {
  const { cart, hasHydrated } = useCartState();

  if (hasHydrated && cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-0">
        <CartEmpty />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto mt-10 px-2 py-8 md:px-0">
        <h1 className="mb-6 text-2xl font-bold">
          Meu Carrinho {!hasHydrated ? "..." : `(${cart.summary.count})`}
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-3">
              {!hasHydrated ? (
                <>
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </>
              ) : (
                cart.items.map((item) => <CartItemCard key={item.id} item={item} />)
              )}
            </div>
          </div>

          <div className="hidden space-y-6 lg:block">
            {!hasHydrated ? (
              <div className="sticky top-24 space-y-3">
                <CartShippingSkeleton />
                <CartSummarySkeleton />
              </div>
            ) : (
              <div className="sticky top-24 space-y-3">
                <CartShippingCalculator />
                <CartSummary summary={cart.summary} />
              </div>
            )}
          </div>
        </div>

        <CartSuggestions />
      </div>

      {hasHydrated && <CartMobileSummaryDrawer summary={cart.summary} />}
    </>
  );
};

export default CartPage;
