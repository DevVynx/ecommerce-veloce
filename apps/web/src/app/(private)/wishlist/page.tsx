"use client";
import type { PublicProductDto, WishlistItemDto } from "@repo/types/contracts";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { removeFromWishlist } from "@/shared/actions/wishlist/removeFromWishlist";
import { PlusIcon } from "@/shared/assets/animatedIcons/plus";
import { ProductDetailsDialog } from "@/shared/components/store/ProductDetailsModal/ProductDetailsDialog";
import { WishlistCard } from "@/shared/components/store/Wishlist/WishlistCard";
import { WishlistEmpty } from "@/shared/components/store/Wishlist/WishlistEmpty";
import { WishlistSkeleton } from "@/shared/components/store/Wishlist/WishlistSkeleton";
import { useAnimatedIcon } from "@/shared/hooks/ui/useAnimatedIcon";
import { useWishlistState } from "@/shared/states/wishlist";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";

const WishlistPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<PublicProductDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { items, hasHydrated, remove, rollback } = useWishlistState();
  const { handleMouseEnter, handleMouseLeave, iconRef } = useAnimatedIcon();

  const handleRemove = async (productId: string) => {
    remove(productId);

    const { error: apiError } = await authenticatedAction(removeFromWishlist, { productId });
    if (apiError) {
      rollback();
    }
  };

  const handleCardClick = (item: WishlistItemDto) => {
    setSelectedProduct({
      id: item.product.id,
      title: item.product.title,
      description: "",
      ratingRate: item.product.ratingRate,
      ratingCount: item.product.ratingCount,
      display: { ...item.product.display },
    });
    setIsDialogOpen(true);
  };

  if (!hasHydrated) {
    return (
      <div className="container mx-auto mt-10 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Minha Lista de Desejos...</h1>
        <WishlistSkeleton />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto mt-10 px-4 py-8">
        <WishlistEmpty />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Minha Lista de Desejos ({items.length})</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <WishlistCard item={item} onRemove={handleRemove} onCardClick={handleCardClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Link href="/#bestOffersSection" id="" className="group mt-14 block">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="border-border hover:border-foreground/20 flex flex-col items-center gap-4 rounded-2xl border py-10 transition hover:scale-[1.02] hover:shadow-lg"
        >
          <div className="rounded-full bg-black p-4 transition group-hover:bg-black/80">
            <PlusIcon ref={iconRef} size={28} className="text-white" />
          </div>
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold">Busque mais produtos</h2>
            <p className="text-muted-foreground max-w-xs text-sm">
              Encontre produtos incríveis e adicione à sua lista de desejos
            </p>
          </div>
          <div className="group-hover:border-foreground/40 group-hover:bg-muted inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition">
            <ShoppingBag className="size-4" />
            Explorar Produtos
          </div>
        </div>
      </Link>

      <ProductDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
      />
    </div>
  );
};

export default WishlistPage;
